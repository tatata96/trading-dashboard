import {BINANCE_API_URL} from "@/constants/binanceApiConstanst";
import {BinanceKlineResponse, klineMaxLimit} from "@/types/Kline.types";

export const binanceApi = {
  async fetchKlineData(symbol: string, interval: string, limit: number = klineMaxLimit): Promise<BinanceKlineResponse[]> {
    try {
      const response = await fetch(`${BINANCE_API_URL}/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      return response.json();
    } catch (error) {
      console.error("Error fetching Kline data:", error);
      throw error;
    }
  },
};
