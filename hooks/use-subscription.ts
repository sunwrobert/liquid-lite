'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { z } from 'zod';

const WS_URL = 'wss://api.hyperliquid.xyz/ws';
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

type SubscriptionKey = string;
type SubscriptionData<TData = unknown> = {
  subscriptionMessage: object;
  responseSchema: z.ZodSchema<TData>;
  callbacks: Set<{
    onResult: (data: TData) => void;
    onError?: (error: Error) => void;
  }>;
};

type ConnectionData = {
  ws: WebSocket | null;
  subscriptions: Map<SubscriptionKey, SubscriptionData<unknown>>;
  isConnecting: boolean;
  isConnected: boolean;
  reconnectAttempts: number;
  reconnectTimeout: NodeJS.Timeout | null;
};

class WebSocketManager {
  private readonly connections = new Map<string, ConnectionData>();

  private createSubscriptionKey(subscriptionMessage: object): SubscriptionKey {
    return JSON.stringify(subscriptionMessage);
  }

  private getOrCreateConnection(wsUrl: string): ConnectionData {
    if (!this.connections.has(wsUrl)) {
      this.connections.set(wsUrl, {
        ws: null,
        subscriptions: new Map(),
        isConnecting: false,
        isConnected: false,
        reconnectAttempts: 0,
        reconnectTimeout: null,
      });
    }
    const connection = this.connections.get(wsUrl);
    if (!connection) {
      throw new Error(`Connection not found for ${wsUrl}`);
    }
    return connection;
  }

  private handleMessage(event: MessageEvent, connection: ConnectionData) {
    try {
      const rawData = JSON.parse(event.data);

      // Find matching subscription by trying to parse with each schema
      for (const [, subscriptionData] of connection.subscriptions) {
        try {
          const validatedData = subscriptionData.responseSchema.parse(rawData);
          // Notify all callbacks for this subscription
          for (const callback of subscriptionData.callbacks) {
            callback.onResult(validatedData);
          }
          return; // Successfully handled, exit loop
        } catch {
          // Parsing failed, try next subscription schema
        }
      }

      // If no subscription could handle the message, ignore it silently
    } catch (parseError) {
      const wsError =
        parseError instanceof Error
          ? parseError
          : new Error('Failed to parse WebSocket message');

      // Notify all error callbacks
      this.notifyErrorCallbacks(connection, wsError);
    }
  }

  private notifyErrorCallbacks(connection: ConnectionData, error: Error) {
    for (const [, subscriptionData] of connection.subscriptions) {
      for (const callback of subscriptionData.callbacks) {
        callback.onError?.(error);
      }
    }
  }

  private connect(wsUrl: string, connection: ConnectionData) {
    if (
      connection.isConnecting ||
      connection.ws?.readyState === WebSocket.CONNECTING ||
      connection.ws?.readyState === WebSocket.OPEN
    ) {
      return;
    }

    connection.isConnecting = true;
    const ws = new WebSocket(wsUrl);
    connection.ws = ws;

    ws.onopen = () => {
      connection.isConnecting = false;
      connection.isConnected = true;
      connection.reconnectAttempts = 0;

      // Send all pending subscriptions
      for (const [, subscriptionData] of connection.subscriptions) {
        ws.send(JSON.stringify(subscriptionData.subscriptionMessage));
      }
    };

    ws.onmessage = (event) => {
      this.handleMessage(event, connection);
    };

    ws.onerror = () => {
      const wsError = new Error('WebSocket connection error');
      this.notifyErrorCallbacks(connection, wsError);
    };

    ws.onclose = () => {
      connection.isConnecting = false;
      connection.isConnected = false;

      // Attempt reconnection if we have active subscriptions and haven't exceeded max attempts
      if (
        connection.subscriptions.size > 0 &&
        connection.reconnectAttempts < MAX_RECONNECT_ATTEMPTS
      ) {
        connection.reconnectAttempts += 1;
        connection.reconnectTimeout = setTimeout(() => {
          this.connect(wsUrl, connection);
        }, RECONNECT_DELAY_MS);
      }
    };
  }

  subscribe<TData>({
    subscriptionMessage,
    responseSchema,
    onResult,
    onError,
  }: {
    subscriptionMessage: object;
    responseSchema: z.ZodSchema<TData>;
    onResult: (data: TData) => void;
    onError?: (error: Error) => void;
  }) {
    const connection = this.getOrCreateConnection(WS_URL);
    const subscriptionKey = this.createSubscriptionKey(subscriptionMessage);
    const callback = { onResult: onResult as (data: unknown) => void, onError };

    // Add or update subscription
    if (connection.subscriptions.has(subscriptionKey)) {
      connection.subscriptions.get(subscriptionKey)?.callbacks.add(callback);
    } else {
      connection.subscriptions.set(subscriptionKey, {
        subscriptionMessage,
        responseSchema: responseSchema as z.ZodSchema<unknown>,
        callbacks: new Set([callback]),
      });
    }

    // Connect if not already connected or connecting
    if (!(connection.isConnected || connection.isConnecting)) {
      this.connect(WS_URL, connection);
    } else if (connection.isConnected && connection.ws) {
      // Send subscription immediately if already connected
      connection.ws.send(JSON.stringify(subscriptionMessage));
    }

    // Return cleanup function
    return () => {
      this.unsubscribe(connection, subscriptionKey, callback);
    };
  }

  private unsubscribe(
    connection: ConnectionData,
    subscriptionKey: string,
    callback: {
      onResult: (data: unknown) => void;
      onError?: (error: Error) => void;
    }
  ) {
    const subscriptionData = connection.subscriptions.get(subscriptionKey);
    if (!subscriptionData) {
      return;
    }

    subscriptionData.callbacks.delete(callback);

    // Remove subscription if no more callbacks
    if (subscriptionData.callbacks.size === 0) {
      connection.subscriptions.delete(subscriptionKey);

      // Close connection if no more subscriptions
      if (connection.subscriptions.size === 0) {
        this.closeConnection(connection);
      }
    }
  }

  private closeConnection(connection: ConnectionData) {
    if (connection.reconnectTimeout) {
      clearTimeout(connection.reconnectTimeout);
      connection.reconnectTimeout = null;
    }

    if (connection.ws) {
      const ws = connection.ws;
      connection.ws = null;

      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }
    }

    connection.isConnecting = false;
    connection.isConnected = false;
    connection.reconnectAttempts = 0;
  }
}

// Singleton instance
const wsManager = new WebSocketManager();

type SubscriptionOptions<TData> = {
  subscriptionMessage: object;
  responseSchema: z.ZodSchema<TData>;
  pause?: boolean;
  onResult: (data: TData) => void;
  onError?: (error: Error) => void;
};

export function useSubscription<TData>({
  subscriptionMessage,
  responseSchema,
  pause = false,
  onResult,
  onError,
}: SubscriptionOptions<TData>) {
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const subscriptionMessageRef = useRef(subscriptionMessage);
  const responseSchemaRef = useRef(responseSchema);

  // Update refs when props change
  onResultRef.current = onResult;
  onErrorRef.current = onError;
  subscriptionMessageRef.current = subscriptionMessage;
  responseSchemaRef.current = responseSchema;

  const unsubscribeRef = useRef<(() => void) | null>(null);

  const subscribe = useCallback(() => {
    if (pause) {
      return;
    }

    // Clean up existing subscription
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    // Create new subscription
    unsubscribeRef.current = wsManager.subscribe({
      subscriptionMessage: subscriptionMessageRef.current,
      responseSchema: responseSchemaRef.current,
      onResult: (data) => onResultRef.current(data),
      onError: (error) => onErrorRef.current?.(error),
    });
  }, [pause]);

  const unsubscribe = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  // Subscribe/unsubscribe based on pause state
  useEffect(() => {
    if (pause) {
      unsubscribe();
    } else {
      subscribe();
    }

    return unsubscribe;
  }, [pause, subscribe, unsubscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return unsubscribe;
  }, [unsubscribe]);
}
