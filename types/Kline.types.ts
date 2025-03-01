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


  // API types
  export interface BinanceKlineResponse {
    0: number; // Open time
    1: string; // Open price
    2: string; // High price
    3: string; // Low price
    4: string; // Close price
    5: string; // Volume
    6: number; // Close time
    7: string; // Quote asset volume
    8: number; // Number of trades
    9: string; // Taker buy base asset volume
    10: string; // Taker buy quote asset volume
    11?: string; // Ignore (optional)
  }

export const klineMaxLimit = 50;
