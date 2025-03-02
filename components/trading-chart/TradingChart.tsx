"use client";

import { useEffect, useState } from "react";
import { binanceApi } from "@/api/binanceApi";
import { INTERVALS } from "@/constants/klineConstants";
import { BinanceKlineResponse, KlineInterval } from "@/types/Kline.types";
import CandlestickChart from "./candlestick-chart/CandlestickChart";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";
import { useKlineWebSocket } from "@/hooks/kline/useKlineWebSocket";

interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<KlineInterval>("1m");
  const [historicalData, setHistoricalData] = useState<CandlestickData<UTCTimestamp>[]>([]);
  
  const { klineEntries, isLoading, error } = useKlineWebSocket(symbol, selectedInterval);

  // Fetch historical data before WebSocket starts
  useEffect(() => {
    async function fetchHistoricalData() {
      try {
        const rawData: BinanceKlineResponse[] = await binanceApi.fetchKlineData(symbol, selectedInterval);

        const formattedData: CandlestickData<UTCTimestamp>[] = rawData.map((item) => ({
          time: convertToMiliseconds(item[0]),
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

  // Handle WebSocket real-time data updates
  useEffect(() => {
    if (klineEntries.length === 0) return;

    const latestKline = klineEntries[klineEntries.length - 1];

    const newDataPoint: CandlestickData<UTCTimestamp> = {
      time: convertToMiliseconds(latestKline.time),
      open: parseFloat(latestKline.open),
      high: parseFloat(latestKline.high),
      low: parseFloat(latestKline.low),
      close: parseFloat(latestKline.close),
    };

    setHistoricalData((prev) => {
      const lastDataPoint = prev.length > 0 ? prev[prev.length - 1] : null;

      if (lastDataPoint && newDataPoint.time === lastDataPoint.time) {
        return [...prev.slice(0, -1), newDataPoint];
      }

      if (lastDataPoint && newDataPoint.time < lastDataPoint.time) {
        console.warn("Skipping outdated WebSocket data:", newDataPoint);
        return prev;
      }

      return [...prev, newDataPoint].slice(-50);
    });
  }, [klineEntries]);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2 text-white">Chart - {symbol}</h2>

      <div className="w-full grid grid-rows-2 gap-4">
        {isLoading &&  (
          <div className="flex items-center justify-center text-center py-4 h-[480px] text-gray-400">
            <span className="animate-pulse">Loading chart data...</span>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center text-center py-4 h-[480px] text-[#ef5350]">
            {error}
          </div>
        )}

         {!error && !isLoading && <CandlestickChart chartData={historicalData} />} 

        {/* Interval Selection Buttons */}
        <div className="flex flex-wrap gap-16 mt-4">
          {INTERVALS.map((interval) => (
            <button
              key={interval}
              onClick={() => setSelectedInterval(interval as KlineInterval)}
              className={`h-fit py-1 border-none bg-transparent hover:cursor-pointer ${selectedInterval === interval ? "text-white" : "text-gray-500"
                }`}
            >
              {interval}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  function convertToMiliseconds(timestamp: number): UTCTimestamp {
    return (timestamp > 10000000000 ? Math.floor(timestamp / 1000) : timestamp) as UTCTimestamp;
  }
}
