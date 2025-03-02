"use client";

import { BINANCE_WS_URL } from "@/constants/binanceApiConstanst";
import { useEffect, useRef, useState } from "react";

export function useBinanceWebSocket<T>(streams: string[], callback: (data: T) => void, id: number) {
  const wsRef = useRef<WebSocket | null>(null);
  const currentStreamsRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  function connectWebSocket() {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      console.log("⚠️ WebSocket already exists. Skipping new connection.");
      return;
    }

    console.log("🔌 Connecting to Binance WebSocket...");
    setIsLoading(true);
    setError(null); 

    try {
      wsRef.current = new WebSocket(BINANCE_WS_URL);

      wsRef.current.onopen = () => {
        console.log("✅ WebSocket Connected");
        setIsLoading(false);
        subscribeToStreams(streams);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data?.result === null) return;
          callback(data);
        } catch (err) {
          console.error("❌ WebSocket JSON Parsing Error:", err);
          setError("Error processing WebSocket data.");
        }
      };

      wsRef.current.onerror = (err) => {
        console.error("❌ WebSocket Error:", err);
        setError("WebSocket connection failed.");
        setIsLoading(false);
      };

      wsRef.current.onclose = (event) => {
        console.warn(`⚠️ WebSocket Disconnected! Code: ${event.code}, Reason: ${event.reason || "No reason provided"}`);
        setIsLoading(false);
      };
    } catch (err) {
      console.error("❌ WebSocket Initialization Error:", err);
      setError("WebSocket connection failed.");
      setIsLoading(false);
    }
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

    return () => {
      if (!wsRef.current) return;

      if (currentStreamsRef.current.length > 0) {
        console.log("🚫 Unsubscribing before switching streams:", currentStreamsRef.current);
        wsRef.current.send(JSON.stringify({ method: "UNSUBSCRIBE", params: currentStreamsRef.current, id }));
      }

      currentStreamsRef.current = [];
    };
  }, [streams.join(",")]);
  
  return { isLoading, error };
}
