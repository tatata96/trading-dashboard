"use client";

import {binanceApi} from "@/api/binanceApi";
import {INTERVALS} from "@/constants/klineConstants";
import {BinanceKlineResponse} from "@/types/Kline.types";
import { useEffect, useState } from "react";

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [historicalData, setHistoricalData] = useState<BinanceKlineResponse[]>([]);

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        const data = await binanceApi.fetchKlineData(symbol, selectedInterval);
        setHistoricalData(data);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }

    fetchHistoricalData();
  }, [symbol, selectedInterval]);

  return (
    <div>
      {/* Interval Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {INTERVALS.map((interval) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(interval)}
            className={`px-3 py-1 border rounded ${
              selectedInterval === interval ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {interval}
          </button>
        ))}
      </div>

      {/* Display Historical Data */}
      <div className="p-4 border rounded">
        <h2 className="text-lg font-bold">Trading Data: {symbol} ({selectedInterval})</h2>
        <ul>
          {historicalData.map((item, index) => (
            <li key={index}>
              Time: {new Date(item[0]).toLocaleTimeString()}, Open: {item[1]}, High: {item[2]}, Low: {item[3]}, Close: {item[4]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
