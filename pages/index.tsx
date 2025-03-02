import OrderBookDepthTable from "@/components/order-book/OrderBook";
import TradingChart from "@/components/trading-chart/TradingChart";
import {useState} from "react";

export default function Home() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const tradingPairs = [
    {symbol: "BTCUSDT", title: "BTC/USDT"},
    {symbol: "ETHUSDT", title: "ETH/USDT"},
    {symbol: "SOLUSDT", title: "SOL/USDT"},
    {symbol: "DOGEUSDT", title: "DOGE/USDT"},
    {symbol: "XRPUSDT", title: "XRP/USDT"},
  ];
  return (
    <div className="px-4">
      <select
        className="w-full mt-4 p-2 border rounded-md text-white bg-gray-800"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        {tradingPairs.map(({symbol, title}) => (
          <option key={symbol} value={symbol}>
            {title}
          </option>
        ))}
      </select>

      <main className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-16 mt-8">
        <OrderBookDepthTable symbol={symbol} />

        <TradingChart symbol={symbol} />
      </main>
    </div>
  );
}
