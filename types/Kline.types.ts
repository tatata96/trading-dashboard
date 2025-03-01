export interface KlineUpdateMessage {
  e: "kline"; // Event type
  E: number; // Event time
  s: string; // Symbol
  k: {
    t: number; // Kline start time (in seconds)
    T: number; // Kline close time
    s: string; // Symbol
    i: string; // Interval
    o: string; // Open price
    c: string; // Close price
    h: string; // High price
    l: string; // Low price
    v: string; // Volume
    x: boolean; // Is this kline closed?
  };
}

export interface KlineEntry {
  time: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  isClosed: boolean;
}

export type KlineInterval =
  | "1s"
  | "1m"
  | "3m"
  | "5m"
  | "15m"
  | "30m"
  | "1h"
  | "2h"
  | "4h"
  | "6h"
  | "8h"
  | "12h"
  | "1d"
  | "3d"
  | "1w"
  | "1M";
