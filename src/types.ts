// src/types.ts
export type EventName =
  | "pull_request.opened"
  | "pull_request.synchronize"
  | "pull_request.closed";

export type WebhookEvent = {
  deliveryId: string;
  name: string;
  payload: any;
};

export type ReviewJob = {
  prNumber: number;
  repo: string;
  status: "scheduled" | "closed";
  updatedAt: number;
};

export type Comment = {
  prNumber: number;
  repo: string;
  body: string;
  createdAt: number;
};
