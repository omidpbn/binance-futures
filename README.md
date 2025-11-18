# binance-futures

src/
 ├─ app/                         → Application pages and route-based components
 │   └─ futures/
 │       └─ [pair]/              → Dynamic route for each trading pair
 │           ├─ @exchange/       → Components and forms for asset exchange (ExchangeForm etc.)
 │           ├─ @orderbook/      → OrderBook section, display buy/sell orders
 │           ├─ @tables/         → Tables and data display components
 │           ├─ layout/          → Layout files for Futures page (header, footer, main layout)
 │           ├─ loading/         → Components and logic for page loading states
 │           └─ page.tsx         → Main page component for dynamic [pair] route
 ├─ config/                      → Global configuration files
 │   ├─ axiosConfig.ts           → Axios HTTP request configuration
 │   └─ socketConfig.ts          → WebSocket connection configuration
 ├─ constants/                   → Global constant values
 │   └─ Tab.ts                   → Tab IDs, names, and options
 ├─ services/                     → Service layer for API calls
 │   ├─ FuturesService.ts        → Futures trading related API and WebSocket calls
 │   └─ WebService.ts            → General web service functions
 ├─ store/                        → State management (Zustand or custom hooks)
 │   ├─ useOrderBookStore.ts     → State for OrderBook (orders, trades)
 │   └─ useStoreTheme.ts         → Theme state management
 ├─ types/                        → TypeScript type definitions
 │   ├─ OrderBook.ts             → Types/interfaces for OrderBook
 │   ├─ TabSwitcher.ts           → Types for TabSwitcher component
 │   ├─ TradeInfo.ts             → Types for trade info display
 │   └─ ...                      → Additional types for other features
 ├─ utils/                        → Utility functions and helpers
 │   ├─ orderbook/               → OrderBook related helper functions
 │   └─ ...                      → General utility functions
 ├─ hooks/                        → Shared React hooks
 │   └─ useGeneralSocket.ts      → General WebSocket connection hook
 ├─ modules/                      → Feature-specific components
 │   └─ components/
 │       ├─ atoms/                  → Smallest reusable UI components
 │       │   ├─ Illustrator.tsx     → Graphics or drawing component
 │       │   ├─ CustomRangeSlider.tsx → Slider for selecting percentage or value
 │       │   └─ TabSwitcher.tsx     → Tab switcher for switching between views
 │       ├─ molecules/              → Combination of multiple atoms for small functional UI
 │       │   ├─ OrderRow.tsx        → Single row in OrderBook displaying one order
 │       │   └─ TradeRow.tsx        → Single row displaying trade summary or info
 │       └─ organisms/              → Combination of molecules and atoms for larger UI blocks
 │           ├─ Account.tsx         → Display and manage user account info
 │           ├─ ExchangeForm.tsx    → Form component for asset exchange/trading
 │           ├─ OrderBook.tsx       → Full OrderBook table with orders and trades
 │           ├─ Tables.tsx          → Data table components for multiple use-cases
 │           ├─ TradeInfo.tsx       → Detailed information of a single trade
 │           ├─ Trade.tsx           → Complete trade display card or section
 │           └─ TradingView.tsx     → TradingView chart integration for price/market charts
 └─ shared/                       → Shared components, hooks, services, store, types, utils
     ├─ components/              → Shared UI components
     │   ├─ atoms/               → Smallest reusable components
     │   │   ├─ Button.tsx       → Reusable button component
     │   │   ├─ Input.tsx        → Reusable input field
     │   │   ├─ Illustrator.tsx  → Graphics or drawing component
     │   │   ├─ Loading.tsx      → Loader/spinner component
     │   │   ├─ MenuLink.tsx     → Menu link component
     │   │   ├─ ThemeSwitcher.tsx→ Toggle light/dark theme
     │   │   └─ ProviderToast.tsx→ Toast notifications provider
     │   ├─ molecules/           → Combination of multiple atoms for small functional UI
     │   └─ organisms/           → Combination of molecules and atoms for larger UI blocks
     │       └─ Header.tsx       → Site header including menu, logo, buttons, theme toggle
     ├─ hooks/                   → Shared React hooks
     │   └─ useGeneralSocket.ts  → General WebSocket connection hook
     ├─ services/                → Shared service functions
     │   └─ WebService.ts        → General web service API calls
     ├─ store/                   → Shared state management hooks
     │   └─ useStoreTheme.ts     → Theme state hook
     ├─ types/                   → Shared TypeScript type definitions
     │   └─ ...                  → Types for shared components and features
     └─ utils/                   → Shared utility/helper functions
         └─ ...                  → General-purpose helpers
