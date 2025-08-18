'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { z } from 'zod';

const WS_URL = 'wss://api.hyperliquid.xyz/ws';
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

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
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const isConnectedRef = useRef(false);
  const errorRef = useRef<Error | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const subscriptionMessageRef = useRef(subscriptionMessage);
  const responseSchemaRef = useRef(responseSchema);

  // Update refs when props change
  onResultRef.current = onResult;
  onErrorRef.current = onError;
  subscriptionMessageRef.current = subscriptionMessage;
  responseSchemaRef.current = responseSchema;

  const connect = useCallback(() => {
    if (pause) {
      return;
    }

    // Prevent multiple connection attempts
    if (wsRef.current) {
      const currentState = wsRef.current.readyState;
      if (
        currentState === WebSocket.CONNECTING ||
        currentState === WebSocket.OPEN
      ) {
        return;
      }
    }

    if (isConnectingRef.current) {
      return;
    }

    isConnectingRef.current = true;
    errorRef.current = null;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      isConnectingRef.current = false;
      isConnectedRef.current = true;
      reconnectAttemptsRef.current = 0;

      // Send subscription message
      ws.send(JSON.stringify(subscriptionMessageRef.current));
    };

    ws.onmessage = (event) => {
      try {
        const rawData = JSON.parse(event.data);
        const validatedData = responseSchemaRef.current.parse(rawData);
        onResultRef.current(validatedData);
      } catch (parseError) {
        const wsError =
          parseError instanceof Error
            ? parseError
            : new Error('Failed to parse WebSocket message');
        errorRef.current = wsError;
        onErrorRef.current?.(wsError);
      }
    };

    ws.onerror = () => {
      const wsError = new Error('WebSocket connection error');
      errorRef.current = wsError;
      onErrorRef.current?.(wsError);
    };

    ws.onclose = () => {
      isConnectingRef.current = false;
      isConnectedRef.current = false;

      // Attempt reconnection if not paused and haven't exceeded max attempts
      if (!pause && reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttemptsRef.current += 1;
        reconnectTimeoutRef.current = setTimeout(connect, RECONNECT_DELAY_MS);
      }
    };
  }, [pause]);

  const disconnect = useCallback(() => {
    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // Close existing WebSocket connection
    if (wsRef.current) {
      const ws = wsRef.current;
      wsRef.current = null; // Clear ref first to prevent race conditions

      if (
        ws.readyState === WebSocket.CONNECTING ||
        ws.readyState === WebSocket.OPEN
      ) {
        ws.close();
      }
    }

    isConnectingRef.current = false;
    isConnectedRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, []);

  // Connect/disconnect based on pause state
  useEffect(() => {
    if (pause) {
      disconnect();
    } else {
      connect();
    }

    return disconnect;
  }, [pause, connect, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return disconnect;
  }, [disconnect]);
}
