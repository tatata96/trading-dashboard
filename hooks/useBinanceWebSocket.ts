"use client";

import {BINANCE_WS_URL} from "@/constants/binanceApiConstanst";
import {useEffect, useRef} from "react";

export function useBinanceWebSocket<T>(streams: string[], callback: (data: T) => void, id: number) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  function connectWebSocket() {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      console.log("WebSocket already exists or is closing. Skipping new connection.");
      return;
    }

    console.log("🔌 Connecting to Binance WebSocket...");
    const ws = new WebSocket(BINANCE_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket Connected:", streams);
      const subscribeMessage = {
        method: "SUBSCRIBE",
        params: streams,
        id: id
      };
      ws.send(JSON.stringify(subscribeMessage));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📦 WebSocket Message:", event.data);
        if (data?.result === null) return; // Ignore confirmation messages
        callback(data);
      } catch (error) {
        console.error("❌ WebSocket JSON Parsing Error:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      console.warn("⚠️ WebSocket Disconnected. Code:", event.code);
      if (![1000, 1005].includes(event.code)) {
        console.log("🔄 Reconnecting WebSocket in 5 seconds...");
        reconnectTimeoutRef.current = setTimeout(connectWebSocket, 5000);
      }
    };
  }

  console.log("🔗 Subscribing to:", streams);
  useEffect(() => {
    if (!streams.length) return;
    connectWebSocket();

    return () => {
      if (wsRef.current) {
        console.log("🚫 Unsubscribing from:", streams);
        const unsubscribeMessage = {
          method: "UNSUBSCRIBE",
          params: streams,
          id: Date.now(),
        };

        try {
          if (wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify(unsubscribeMessage));
          }
        } catch (error) {
          console.error("❌ Error sending unsubscribe message:", error);
        }

        wsRef.current.close();
        wsRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [streams.join(",")]); 

  return {};
}