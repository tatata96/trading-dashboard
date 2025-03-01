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

    if (!chartRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 480,
        layout: { background: { color: "#181a1f" }, textColor: "white" },
        grid: { vertLines: { color: "#2f2e2d" }, horzLines: { color: "#2f2e2d" } },
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

    if (seriesRef.current) {
      seriesRef.current.setData(chartData);
    }

    chartRef.current.timeScale().fitContent();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartData]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full border border-[#2f2e2d] rounded-md shadow-md"
    />
  );
};

export default CandlestickChart;
