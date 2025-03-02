import { DepthUpdateMessage, OrderBook } from "@/types/OrderBook.types";
import { useState } from "react";
import { useBinanceWebSocket } from "../useBinanceWebSocket";
import { depthStreamline } from "@/constants/binanceApiConstanst";

export function useOrderBookWebSocket(symbol: string) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);

  const { isLoading, error } = useBinanceWebSocket<DepthUpdateMessage>(
    [`${symbol.toLowerCase()}@${depthStreamline.name}`],
    (data) => {
      if (!data || !data.a || !data.b) {
        console.warn("Received incomplete order book data", data);
        return;
      }

      setOrderBook({
        asks: data.a.slice(0, 10).map(([price, quantity]) => ({
          price,
          quantity,
        })),
        bids: data.b.slice(0, 10).map(([price, quantity]) => ({
          price,
          quantity,
        })),
      });
    },
    depthStreamline.id
  );

  return { orderBook, isLoading, error };
}