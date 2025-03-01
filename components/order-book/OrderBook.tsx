"use client";

import {useOrderBookWebSocket} from "@/hooks/order-book/useOrderBookWebSocket";
import {DepthTableProps, OrderBookEntry} from "@/types/OrderBook.types";
import {formatPrice} from "@/utils/priceUtils";

export default function OrderBookDepthTable({symbol}: DepthTableProps) {
  const {orderBook} = useOrderBookWebSocket(symbol);

  const renderOrderBookEntries = (orders: OrderBookEntry[], textColor: string) => (
    <div className="grid gap-2 h-[240px]">
      {orders?.map((order, index) => (
        <div key={index} className="grid grid-cols-2 hover:bg-gray-800 transition">
          <span className={`${textColor}`}>{formatPrice(order.price)}</span>
          <span className="text-right">{parseFloat(order.quantity)}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full shadow-md bg--background text-white text-xs">
      <h2 className="text-lg font-semibold mb-2">Order Book - {symbol}</h2>

      <div className="grid grid-rows-2 gap-4">
        {/* Bids Section */}
        {orderBook?.bids && renderOrderBookEntries(orderBook?.bids, "text-green-600")}


        {/* Asks Section */}
        {orderBook?.asks && renderOrderBookEntries(orderBook?.asks, "text-red-700")}
      </div>
    </div>
  );
}
