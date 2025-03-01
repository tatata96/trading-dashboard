
export interface DepthUpdateMessage {
  e: "depthUpdate"; // Event type
  E: number; // Event time
  s: string; // Symbol
  U: number; // First update ID in event
  u: number; // Final update ID in event
  a: [string, string][]; // Asks [price, quantity]
  b: [string, string][]; // Bids [price, quantity]
}

export interface OrderBookEntry {
  price: string;
  quantity: string;
}

export interface OrderBook {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
}