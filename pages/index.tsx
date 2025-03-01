import {useOrderBookWebSocket} from "@/hooks/order-book/useOrderBookWebSocket";
import {useState} from "react";

export default function Home() {
  const [selectedPair] = useState("BTCUSDT");

  const { orderBook } = useOrderBookWebSocket(selectedPair);

  return (
  
    <div>
      HOME

      <div className="w-full p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-2">Order Book - {selectedPair}</h2>

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
                    {parseFloat(bid.price).toFixed(2)}
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
                    {parseFloat(ask.price).toFixed(2)}
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
    </div>
  );
}
