"use client";

import { useRef } from "react";
import { BASE_WS_URL, SOCKET_DEFAULT_OPTIONS } from "@/config/socketConfig";

interface GenericSocketOptions {
  key: string;
  path: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (data: any) => void;
  onError?: (err: Event) => void;
}

export const useGenericSockets = () => {
  const socketsRef = useRef<Record<string, WebSocket | null>>({});
  const reconnectCounts = useRef<Record<string, number>>({});
  const messageQueue = useRef<Record<string, any[]>>({});

  const connect = ({ key, path, onConnect, onDisconnect, onMessage, onError }: GenericSocketOptions) => {
    if (!BASE_WS_URL) throw new Error("BASE_WS_URL is not defined");
    if (socketsRef.current[key]?.readyState === WebSocket.OPEN) return;

    // Binance has two endpoint formats:
    // 1. Combined streams → wss://fstream.binance.com/stream?streams=btcusdt@ticker/btcusdt@markPrice
    // 2. Individual streams → wss://fstream.binance.com/ws/btcusdt@depth@100ms
    // We detect automatically by checking if the path contains "@"
    const useCombinedEndpoint = path.includes("@");

    const url = useCombinedEndpoint ? `${BASE_WS_URL}/stream?streams=${path.toLowerCase()}` : `${BASE_WS_URL}/ws/${path}`;

    const ws = new WebSocket(url);
    socketsRef.current[key] = ws;
    messageQueue.current[key] ||= [];

    ws.onopen = () => {
      reconnectCounts.current[key] = 0;
      console.log(`[WS:${key}] Connected → ${url}`);
      onConnect?.();
    };

    ws.onclose = () => {
      console.log(`[WS:${key}] Disconnected.`);
      socketsRef.current[key] = null;
      onDisconnect?.();

      if (SOCKET_DEFAULT_OPTIONS.reconnect && (reconnectCounts.current[key] || 0) < 5) {
        reconnectCounts.current[key] = (reconnectCounts.current[key] || 0) + 1;
        setTimeout(() => connect({ key, path, onConnect, onDisconnect, onMessage, onError }), SOCKET_DEFAULT_OPTIONS.reconnectInterval);
      }
    };

    ws.onerror = (err) => {
      console.error(`[WS:${key}] Error:`, err);
      onError?.(err);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        // Combined endpoint returns { stream: "...", data: { ... } }
        // Individual endpoint returns the data directly
        const data = msg.data ?? msg;
        messageQueue.current[key].push(data);
      } catch (err) {
        console.error(`[WS:${key}] Failed to parse message:`, err);
      }
    };
  };

  const disconnect = (key: string) => {
    socketsRef.current[key]?.close();
    socketsRef.current[key] = null;
    messageQueue.current[key] = [];
    reconnectCounts.current[key] = 0;
    console.log(`[WS:${key}] Manually disconnected.`);
  };

  const popMessages = (key: string) => {
    const msgs = messageQueue.current[key] || [];
    messageQueue.current[key] = [];
    return msgs;
  };

  return { connect, disconnect, popMessages };
};
