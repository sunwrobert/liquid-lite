# Liquid Lite

A minimal, fast, and modern trading interface for [Hyperliquid](https://hyperliquid.xyz) - a high-performance decentralized exchange for perpetual futures and spot trading.

**[Demo](https://liquid-lite.vercel.app/)**

## Features

### Trading Interface

- **Perpetual Futures Trading**: Trade crypto perpetuals with real-time data
- **Spot Trading**: Trade spot markets with USDC pairs
- **Live Order Book**: Real-time order book with customizable price increments and display modes
- **Live Trades Feed**: Stream of recent trades with price, size, and timing
- **Interactive Charts**: TradingView-style charts with multiple timeframes (1m to 1M)
- **Asset Selection**: Browse and switch between available trading pairs

### Wallet Integration

- **Privy Wallet**: Seamless wallet connection and authentication
- **Wagmi Integration**: Ethereum wallet support with React hooks
- **Address Display**: Formatted wallet address display

### Real-time Data

- **WebSocket Subscriptions**: Live market data via Hyperliquid's WebSocket API
- **Order Book Updates**: Real-time bid/ask updates with depth visualization
- **Trade Stream**: Live trade execution data
- **Price Charts**: Real-time candlestick data with multiple intervals

### User Experience

- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Modern dark interface optimized for trading
- **Fast Performance**: Built with Next.js 15 and React 19 for optimal speed
- **Type Safety**: Full TypeScript implementation with Zod validation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Charts**: Lightweight Charts (TradingView library)
- **Data Fetching**: TanStack Query with WebSocket subscriptions
- **Wallet**: Privy + Wagmi for Ethereum wallet integration
- **API**: Hyperliquid public API and WebSocket feeds
- **Code Quality**: Ultracite (Biome-based) for formatting and linting

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- A crypto wallet (MetaMask, WalletConnect, etc.)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd liquid-lite
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm format` - Format code with Ultracite
- `pnpm lint` - Lint code and check for unused exports
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
liquid-lite/
├── app/                    # Next.js App Router pages
│   ├── trade/             # Trading interface routes
│   └── layout.tsx         # Root layout with navbar
├── components/            # Reusable React components
│   ├── asset/            # Asset selection and toolbars
│   ├── icons/            # Custom SVG icons
│   ├── layout/           # Navigation components
│   ├── trade/            # Trading page components
│   ├── ui/               # Base UI components (shadcn/ui)
│   └── wallet/           # Wallet connection components
├── hooks/                # Custom React hooks for data fetching
├── lib/                  # Utility functions and API clients
├── providers/            # React context providers
└── stores/               # State management (if needed)
```

## Key Components

- **TradePage**: Main trading interface with chart and order book
- **LiveOrderBook**: Real-time order book with price aggregation
- **LiveTrades**: Stream of recent trade executions
- **TradingChart**: Interactive price charts with multiple timeframes
- **AssetSelector**: Asset search and selection interface

## API Integration

This app integrates with Hyperliquid's public APIs:

- **REST API**: Asset metadata, historical data, user positions
- **WebSocket API**: Real-time order book, trades, and price feeds

No API keys required for public market data.

## Contributing

1. Follow the established code style (Ultracite formatting)
2. Ensure TypeScript types are properly defined
3. Test on both desktop and mobile viewports
4. Use the existing component patterns and design system
