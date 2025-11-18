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
  // Store WebSocket instances by key/pair
  const socketsRef = useRef<Record<string, WebSocket | null>>({});
  const reconnectCounts = useRef<Record<string, number>>({});
  const messageQueue = useRef<Record<string, any[]>>({});

  const connect = ({ key, path, onConnect, onDisconnect, onMessage, onError }: GenericSocketOptions) => {
    if (!BASE_WS_URL) throw new Error("SOCKET_BASE_URL is not defined");

    // Prevent duplicate connection
    if (socketsRef.current[key]?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${BASE_WS_URL}/ws/${path}`);
    socketsRef.current[key] = ws;
    messageQueue.current[key] ||= [];

    // WebSocket open
    ws.onopen = () => {
      reconnectCounts.current[key] = 0;
      console.log(`[WS:${key}] Connected successfully.`);
      onConnect?.();
    };

    // WebSocket closed
    ws.onclose = () => {
      console.log(`[WS:${key}] Disconnected.`);
      socketsRef.current[key] = null;
      onDisconnect?.();

      if (SOCKET_DEFAULT_OPTIONS.reconnect && reconnectCounts.current[key] < 5) {
        reconnectCounts.current[key] = (reconnectCounts.current[key] || 0) + 1;
        console.log(`[WS:${key}] Attempting reconnect #${reconnectCounts.current[key]}`);
        setTimeout(() => connect({ key, path, onConnect, onDisconnect, onMessage, onError }), SOCKET_DEFAULT_OPTIONS.reconnectInterval);
      }
    };

    // WebSocket error
    ws.onerror = (err) => {
      console.error(`[WS:${key}] Error occurred:`, err);
      onError?.(err);
    };

    // WebSocket message
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        messageQueue.current[key].push(data);
        // console.log(`[WS:${key}] Message received:`, data);
      } catch (err) {
        console.error(`[WS:${key}] Failed to parse message:`, err);
      }
    };
  };

  // Manual disconnect
  const disconnect = (key: string) => {
    const ws = socketsRef.current[key];
    if (ws) ws.close();
    socketsRef.current[key] = null;
    messageQueue.current[key] = [];
    reconnectCounts.current[key] = 0;
    console.log(`[WS:${key}] Manually disconnected.`);
  };

  // Pop all queued messages for a specific key
  const popMessages = (key: string) => {
    const msgs = messageQueue.current[key] || [];
    messageQueue.current[key] = [];
    // if (msgs.length) console.log(`[WS:${key}] Popped ${msgs.length} messages from queue.`);
    return msgs;
  };

  return { connect, disconnect, popMessages };
};
