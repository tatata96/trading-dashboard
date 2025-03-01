import OrderBookDepthTable from "@/components/order-book/OrderBook";
import TradingChart from "@/components/trading-chart/TradingChart";
import {useState} from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("BTCUSDT");

  return (
    <div className="px-4">
      <select
        className="mt-4 p-2 border rounded-md text-white"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="SOLUSDT">SOL/USDT</option>
        <option value="DOGEUSDT">DOGE/USDT</option>
      </select>

      <main className="grid grid-cols-[240px_1fr] gap-16 mt-8">
        <OrderBookDepthTable symbol={symbol} />

        <TradingChart symbol={symbol} />
      </main>
    </div>
  );
}
