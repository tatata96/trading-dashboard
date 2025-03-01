"use client";

import { useEffect, useRef } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp, CandlestickSeries } from "lightweight-charts";

interface CandlestickChartProps {
  chartData: CandlestickData<UTCTimestamp>[];
}

const CandlestickChart = ({ chartData }: CandlestickChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Prevent unnecessary chart removals
    if (!chartRef.current) {
      // Create a new chart only if one doesn't exist
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: { background: { color: "#fff" }, textColor: "#000" },
        grid: { vertLines: { color: "rgba(70, 130, 180, 0.5)" }, horzLines: { color: "rgba(70, 130, 180, 0.5)" } },
      });

      chartRef.current = chart;

      // Add Candlestick Series
      const candlestickSeries = chart.addSeries(CandlestickSeries, {
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });

      seriesRef.current = candlestickSeries;
    }

    // Ensure the chart gets the latest data without re-initializing
    if (seriesRef.current) {
      seriesRef.current.setData(chartData);
    }

    return () => {
      // Only dispose when the component unmounts
      if (chartRef.current) {
        chartRef.current.remove();
        // Clear reference
        chartRef.current = null; 
      }
    };
  }, [chartData]);

  return <div ref={chartContainerRef} className="w-full h-96 border" />;
};

export default CandlestickChart;
