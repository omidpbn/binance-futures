"use client";

import { useRef } from "react";
import { BASE_WS_URL, SOCKET_DEFAULT_OPTIONS } from "@/config/socketConfig";

interface GenericSocketOptions<T> {
  key: string;
  path: string;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onMessage?: (data: T) => void;
  onError?: (err: Event) => void;
}

type MessageQueue = Record<string, unknown[]>;

export const useGenericSockets = () => {
  const socketsRef = useRef<Record<string, WebSocket | null>>({});
  const reconnectCounts = useRef<Record<string, number>>({});
  const messageQueue = useRef<MessageQueue>({});

  const connect = <T,>({ key, path, onConnect, onDisconnect, onMessage, onError }: GenericSocketOptions<T>) => {
    if (!BASE_WS_URL) throw new Error("BASE_WS_URL is not defined");
    if (socketsRef.current[key]?.readyState === WebSocket.OPEN) {
      // console.log(`[WS:${key}] Already connected.`);
      return;
    }

    const useCombinedEndpoint = path.includes("@");
    const url = useCombinedEndpoint ? `${BASE_WS_URL}/stream?streams=${path.toLowerCase()}` : `${BASE_WS_URL}/ws/${path}`;

    // console.log(`[WS:${key}] Connecting to ${url}...`);
    const ws = new WebSocket(url);
    socketsRef.current[key] = ws;
    if (!messageQueue.current[key]) messageQueue.current[key] = [];

    ws.onopen = () => {
      reconnectCounts.current[key] = 0;
      console.log(`[WS:${key}] Connected successfully.`);
      onConnect?.();
    };

    ws.onclose = (event) => {
      socketsRef.current[key] = null;
      console.log(`[WS:${key}] Disconnected. Code: ${event.code}, Reason: ${event.reason}`);
      onDisconnect?.();
      if (SOCKET_DEFAULT_OPTIONS.reconnect && (reconnectCounts.current[key] || 0) < 5) {
        reconnectCounts.current[key] = (reconnectCounts.current[key] || 0) + 1;
        // console.log(`[WS:${key}] Attempting reconnect #${reconnectCounts.current[key]} in ${SOCKET_DEFAULT_OPTIONS.reconnectInterval}ms`);
        setTimeout(
          () =>
            connect<T>({
              key,
              path,
              onConnect,
              onDisconnect,
              onMessage,
              onError,
            }),
          SOCKET_DEFAULT_OPTIONS.reconnectInterval
        );
      }
    };

    ws.onerror = (err) => {
      console.error(`[WS:${key}] Error occurred:`, err);
      onError?.(err);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        const data = msg.data ?? msg;
        (messageQueue.current[key] as T[]).push(data as T);
        // console.log(`[WS:${key}] Received message:`, data);
        onMessage?.(data as T);
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

  const popMessages = <T,>(key: string): T[] => {
    const msgs = (messageQueue.current[key] || []) as T[];
    messageQueue.current[key] = [];
    // console.log(`[WS:${key}] Popped ${msgs.length} messages from queue.`);
    return msgs;
  };

  return { connect, disconnect, popMessages };
};
