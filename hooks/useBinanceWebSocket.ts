"use client";

import { BINANCE_WS_URL } from "@/constants/binanceApiConstanst";
import { useEffect, useRef } from "react";

export function useBinanceWebSocket<T>(streams: string[], callback: (data: T) => void, id: number) {
  const wsRef = useRef<WebSocket | null>(null);
  const currentStreamsRef = useRef<string[]>([]);

  function connectWebSocket() {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      console.log("⚠️ WebSocket already exists. Skipping new connection.");
      return;
    }

    console.log("🔌 Connecting to Binance WebSocket...");
    wsRef.current = new WebSocket(BINANCE_WS_URL);

    wsRef.current.onopen = () => {
      console.log("✅ WebSocket Connected");
      subscribeToStreams(streams);
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.result === null) return; 
        callback(data);
      } catch (error) {
        console.error("❌ WebSocket JSON Parsing Error:", error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    wsRef.current.onclose = (event) => {
      console.warn(`⚠️ WebSocket Disconnected! Code: ${event.code}, Reason: ${event.reason || "No reason provided"}`);
    };
  }

  function subscribeToStreams(newStreams: string[]) {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    // Only unsubscribe if switching to a different stream
    if (currentStreamsRef.current.length > 0) {
      console.log("🚫 Unsubscribing from:", currentStreamsRef.current);
      wsRef.current.send(JSON.stringify({ method: "UNSUBSCRIBE", params: currentStreamsRef.current, id }));
    }

    console.log("🔗 Subscribing to:", newStreams);
    wsRef.current.send(JSON.stringify({ method: "SUBSCRIBE", params: newStreams, id }));

    currentStreamsRef.current = newStreams; 
  }

  useEffect(() => {
    if (!streams.length) return;

    if (!wsRef.current) {
      connectWebSocket();
    } else {
      subscribeToStreams(streams);
    }

    // ✅ Prevent closing WebSocket when switching streams
    return () => {
      if (!wsRef.current) return; // Don't close WebSocket if it's still needed

      if (currentStreamsRef.current.length > 0) {
        console.log("🚫 Unsubscribing before switching streams:", currentStreamsRef.current);
        wsRef.current.send(JSON.stringify({ method: "UNSUBSCRIBE", params: currentStreamsRef.current, id }));
      }

      currentStreamsRef.current = [];
    };
  }, [streams.join(",")]); // Track stream changes without closing WebSocket

  return {};
}
