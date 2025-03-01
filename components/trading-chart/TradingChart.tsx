"use client";

import { useEffect, useState } from "react";
import { binanceApi } from "@/api/binanceApi";
import { INTERVALS } from "@/constants/klineConstants";
import { BinanceKlineResponse } from "@/types/Kline.types";
import CandlestickChart from "./candlestick-chart/CandlestickChart";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const [selectedInterval, setSelectedInterval] = useState("1m");
  const [historicalData, setHistoricalData] = useState<CandlestickData<UTCTimestamp>[]>([]);

  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        const rawData: BinanceKlineResponse[] = await binanceApi.fetchKlineData(symbol, selectedInterval);

        const formattedData: CandlestickData<UTCTimestamp>[] = rawData.map((item) => ({
          time: (item[0] / 1000) as UTCTimestamp, // Convert ms → seconds
          open: parseFloat(item[1]),
          high: parseFloat(item[2]),
          low: parseFloat(item[3]),
          close: parseFloat(item[4]),
        }));

        setHistoricalData(formattedData);
      } catch (error) {
        console.error("Error fetching historical data:", error);
      }
    }

    fetchHistoricalData();
  }, [symbol, selectedInterval]);

  console.log(historicalData);

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

      <CandlestickChart chartData={historicalData} />
    </div>
  );
}
