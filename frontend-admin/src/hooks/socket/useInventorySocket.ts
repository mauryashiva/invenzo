// src/hooks/socket/useInventorySocket.ts
import { useEffect, useRef, useState } from "react";

// Centralized Message Types for 4NF scalability
type SocketEvent = {
  type: "STOCK_UPDATE" | "PRICE_UPDATE" | "NEW_BRAND" | "NOTIFICATION";
  payload: any;
};

export function useInventorySocket(
  url: string = "ws://localhost:8000/ws/admin",
) {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // 1. Initialize Connection
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("🚀 SCM Socket Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data: SocketEvent = JSON.parse(event.data);

      // Centralized Event Switch
      switch (data.type) {
        case "STOCK_UPDATE":
          console.log("📦 Real-time Stock Update:", data.payload);
          // Here we would trigger a Zustand store update or React Query invalidation
          break;
        case "NEW_BRAND":
          console.log("🆕 New Brand Added via another Admin:", data.payload);
          break;
        default:
          console.log("🔔 Notification Received:", data.payload);
      }
    };

    ws.onclose = () => {
      console.log("🔌 Socket Disconnected. Attempting reconnect...");
      setIsConnected(false);
      // Logic for auto-reconnect could go here
    };

    return () => {
      ws.close();
    };
  }, [url]);

  // Method to send updates to the server (e.g., manual stock sync)
  const sendMessage = (event: SocketEvent) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(event));
    }
  };

  return { isConnected, sendMessage };
}
