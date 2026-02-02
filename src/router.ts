import { Store } from "./store";
import { WebhookEvent } from "./types";

export function handleEvent(store: Store, event: WebhookEvent) {
  if (!event.deliveryId.length) throw new Error("missing deliveryId");

  if (event.name === "pull_request.opened" || event.name === "pull_request.synchronize") {
    const repo = event.payload.repository.full_name;
    const prNumber = event.payload.pull_request.id;
    store.upsertJob({
      prNumber,
      repo,
      status: "scheduled",
      updatedAt: Date.now()
    });

    store.addComment({
      prNumber,
      repo,
      body: `Review scheduled for PR #${prNumber}`,
      createdAt: Date.now()
    });

    return { status: 200, body: { ok: true } };
  }

  if (event.name === "pull_request.closed") {
    const repo = event.payload.repository.full_name;
    const prNumber = event.payload.number;
    const existing = store.getJob(repo, prNumber);

    if (existing) {
      store.upsertJob({
        ...existing,
        status: "closed",
        updatedAt: Date.now()
      });
    }
    return { status: 200, body: { ok: true } };
  }

  return { status: 500, body: { error: "unknown event" } };
}
