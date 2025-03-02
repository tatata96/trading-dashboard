# Trading Dashboard

A real-time **trading dashboard** that displays **order book depth** and **candlestick charts** using Binance WebSocket API.

---

## Setup & Run Instructions

```bash
git clone https://github.com/your-username/trading-dashboard.git
cd trading-dashboard

npm install
# or
yarn install

npm run dev
```

<br>

## Approach
### WebSocket-Based Real-Time Updates
- The order book and candlestick chart **fetch live data** using the **Binance WebSocket API**.
- Custom hooks (`useBinanceWebSocket`, `useKlineWebSocket`, `useOrderBookWebSocket`) **efficiently manage WebSocket connections**, ensuring that:
  - Each component **subscribes only to relevant streams**.
  - The app **avoids unnecessary re-renders** by handling data updates properly.

### Code & Folder Structure
- Tried to **keep the codebase clean & modular** by separating concerns:
  - **Hooks** (`/hooks`) → Manages WebSocket logic independently.
  - **Components** (`/components`) → Encapsulates UI elements.
  - **Constants** (`/constants`) → Stores WebSocket stream names & IDs.
  - **API Calls** (`/api`) → Manages REST API requests for historical data.


<br>

##  External Libraries Used

### **🔹 Dependencies**
| Library | Version | Purpose |
|---------|---------|---------|
| **next** | 15.2.0 | React framework for SSR & SSG |
| **lightweight-charts** | ^5.0.3 | High-performance candlestick charting |
| **eslint** | ^9 | Linting for code quality |
| **eslint-config-next** | 15.2.0 | ESLint rules for Next.js |
| **@eslint/eslintrc** | ^3 | ESLint configuration support |
| **@types/node** | ^20 | TypeScript definitions for Node.js |
| **@types/react** | ^19 | TypeScript definitions for React |
| **@types/react-dom** | ^19 | TypeScript definitions for React DOM |
| **typescript** | ^5 | TypeScript support |
| **tailwindcss** | ^4 | Utility-first CSS framework for styling |
| **@tailwindcss/postcss** | ^4 | PostCSS plugin for TailwindCSS |


<br>

## Future Improvements

#### 1. Improve WebSocket Resilience, and  WebSocket reconnect logic

#### 2. User Customization: Allow selecting different chart themes and general color theme

#### 3.Optimize Order Book Rendering: Reduce DOM updates for better performance

#### 4. Implement Global Styles & Colors (Low Priority for Small Project)

#### 5. Use Context API for Selected Symbol
