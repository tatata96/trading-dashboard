import OrderBookDepthTable from "@/components/order-book/OrderBook";
import {useState} from "react";

export default function Home() {
  const [selectedPair] = useState("BTCUSDT");

  return (
    <div>
      HOME

    <OrderBookDepthTable symbol={selectedPair} />
    </div>
  );
}
