import OrderBookDepthTable from "@/components/order-book/OrderBook";
import {useKlineWebSocket} from "@/hooks/kline/useKlineWebSocket";
import {useState} from "react";

export default function Home() {
  const [symbol,setSymbol] = useState("BTCUSDT");
  const { klineEntries } = useKlineWebSocket(symbol, "1m");

  console.log(klineEntries);
  return (
    <div>
      HOME

      <select
        className="mt-4 p-2 border rounded-md"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      >
        <option value="BTCUSDT">BTC/USDT</option>
        <option value="ETHUSDT">ETH/USDT</option>
        <option value="SOLUSDT">SOL/USDT</option>
        <option value="DOGEUSDT">DOGE/USDT</option>
      </select>

    <OrderBookDepthTable symbol={symbol} />
    </div>
  );
}
