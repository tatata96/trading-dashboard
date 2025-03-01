"use client";

import {useOrderBookWebSocket} from "@/hooks/order-book/useOrderBookWebSocket";
import {DepthTableProps} from "@/types/OrderBook.types";
import {formatPrice} from "@/utils/priceUtils";

export default function OrderBookDepthTable({ symbol }: DepthTableProps) {
  const { orderBook } = useOrderBookWebSocket(symbol);

  return (
    <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Order Book - {symbol}</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* ✅ Bids Table */}
        <div>
          <h3 className="text-green-600 font-medium mb-2">Bids (Buy Orders)</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-green-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderBook?.bids?.map((bid, index) => (
                <tr key={index} className="hover:bg-green-50">
                  <td className="border border-gray-300 px-4 py-2 text-green-700">
                    {formatPrice(bid.price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {parseFloat(bid.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ✅ Asks Table */}
        <div>
          <h3 className="text-red-600 font-medium mb-2">Asks (Sell Orders)</h3>
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-red-100">
              <tr>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderBook?.asks?.map((ask, index) => (
                <tr key={index} className="hover:bg-red-50">
                  <td className="border border-gray-300 px-4 py-2 text-red-700">
                    {formatPrice(ask.price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {parseFloat(ask.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
