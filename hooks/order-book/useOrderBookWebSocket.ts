import {DepthUpdateMessage, OrderBook} from "@/types/OrderBook.types";
import {useState} from "react";
import {useBinanceWebSocket} from "../useBinanceWebSocket";

export function useOrderBookWebSocket(symbol: string) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
  console.log("orderBook:", orderBook);

  useBinanceWebSocket<DepthUpdateMessage>(
    [`${symbol.toLowerCase()}@depth`], 
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
    1 // Unique subscription ID for order book
  );

  return { orderBook };
}