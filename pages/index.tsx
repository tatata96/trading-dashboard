import OrderBookDepthTable from "@/components/order-book/OrderBook";
import {useState} from "react";

export default function Home() {
  const [selectedPair,setSelectedPair] = useState("BTCUSDT");

  return (
    <div>
      HOME

      <select
        className="mt-4 p-2 border rounded-md"
        value={selectedPair}
        onChange={(e) => setSelectedPair(e.target.value)}
      >
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="SOLUSDT">SOL/USDT</option>
        <option value="DOGEUSDT">DOGE/USDT</option>
      </select>

    <OrderBookDepthTable symbol={selectedPair} />
    </div>
  );
}
