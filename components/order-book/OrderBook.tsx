"use client";

import {useOrderBookWebSocket} from "@/hooks/order-book/useOrderBookWebSocket";
import {DepthTableProps, OrderBookEntry} from "@/types/OrderBook.types";
import {formatPrice} from "@/utils/priceUtils";

export default function OrderBookDepthTable({symbol}: DepthTableProps) {
  const {orderBook, isLoading, error} = useOrderBookWebSocket(symbol);

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
    <div className="w-full shadow-md bg--background text-white">
      <h2 className="text-lg font-semibold mb-2">Order Book - {symbol}</h2>

      {isLoading && (
        <div className="flex items-center justify-center text-center py-4 h-[480px] text-gray-400">
          <span className="animate-pulse">Loading order book data...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center text-center py-4 h-[480px] text-[#ef5350]">
          {error}
        </div>
      )}

      {!error && !isLoading &&
        <div className="grid grid-rows-2 gap-4 text-xs">
          {/* Bids Section */}
          {orderBook?.bids && renderOrderBookEntries(orderBook?.bids, "text-[#26a69a]")}


          {/* Asks Section */}
          {orderBook?.asks && renderOrderBookEntries(orderBook?.asks, "text-[#ef5350]")}
        </div>}
    </div>
  );
}
