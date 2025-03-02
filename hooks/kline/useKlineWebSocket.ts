"use client";

import {useState} from "react";
import {useBinanceWebSocket} from "../useBinanceWebSocket";
import {KlineEntry, KlineInterval, KlineUpdateMessage} from "@/types/Kline.types";
import {klineStreamline} from "@/constants/binanceApiConstanst";

export function useKlineWebSocket(selectedPair: string, interval: KlineInterval = "1m") {
  const [klineEntries, setKlineEntries] = useState<KlineEntry[]>([]);

  const {isLoading, error} = useBinanceWebSocket<KlineUpdateMessage>(
    [`${selectedPair.toLowerCase()}@${klineStreamline.name}_${interval}`],
    (data) => {
      if (!data || !data.k) {
        console.warn("Received incomplete kline data", data);
        return;
      }

       setKlineEntries((prev) => {
        const newCandle: KlineEntry = {
          time: Math.floor(data.k.t / 1000),
          open: data.k.o,
          high: data.k.h,
          low: data.k.l,
          close: data.k.c,
          volume: data.k.v,
          isClosed: data.k.x,
        };

        if (prev.length === 0) return [newCandle];

        const lastCandle = prev[prev.length - 1];

        if (lastCandle.time === newCandle.time) {
          // Update last candle if it's still open
          if (!lastCandle.isClosed) {
            return [...prev.slice(0, -1), newCandle];
          }
          // Ignore update if last candle is closed
          return prev;
        } else {
          // Add new candle, keeping only the last 50
          return [...prev, newCandle].slice(-50);
        }
      });

    },
    klineStreamline.id
  );

  return {klineEntries, isLoading, error};
}
