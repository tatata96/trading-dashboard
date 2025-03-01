"use client";

import { useEffect, useState } from "react";
import { binanceApi } from "@/api/binanceApi";
import { INTERVALS } from "@/constants/klineConstants";
import { BinanceKlineResponse, KlineInterval } from "@/types/Kline.types";
import CandlestickChart from "./candlestick-chart/CandlestickChart";
import { CandlestickData, UTCTimestamp } from "lightweight-charts";
import {useKlineWebSocket} from "@/hooks/kline/useKlineWebSocket";
interface TradingChartProps {
  symbol: string;
}

export default function TradingChart({ symbol }: TradingChartProps) {
  const [selectedInterval, setSelectedInterval] = useState<KlineInterval>("1m");
  const [historicalData, setHistoricalData] = useState<CandlestickData<UTCTimestamp>[]>([]);
  const { klineEntries } = useKlineWebSocket(symbol, selectedInterval);

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
        // Update last candle if it's the same time
        return [...prev.slice(0, -1), newDataPoint];
      }

      if (lastDataPoint && newDataPoint.time < lastDataPoint.time) {
        console.warn("Skipping outdated WebSocket data:", newDataPoint);
        return prev;
      }

      // Append new candle & limit history to 50
      return [...prev, newDataPoint].slice(-50);
    });
  }, [klineEntries]);

  return (
    <div>
      {/* Interval Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {INTERVALS.map((interval) => (
          <button
            key={interval}
            onClick={() => setSelectedInterval(interval as KlineInterval)}
            className={`px-3 py-1 border rounded ${
              selectedInterval === interval ? "bg-blue-500 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {interval}
          </button>
        ))}
      </div>

      {/* Historical CandlestickChart */}
      <CandlestickChart chartData={historicalData} />
    </div>
  );

  // todo: move to utils
 function convertToMiliseconds(timestamp: number): UTCTimestamp {
    return (timestamp > 10000000000 ? Math.floor(timestamp / 1000) : timestamp) as UTCTimestamp;
  }
}
