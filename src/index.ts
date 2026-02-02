import { Store } from "./store";
import { alreadyProcessed } from "./dedupe";
import { handleEvent } from "./router";
import { WebhookEvent } from "./types";

export function processWebhook(store: Store, event: WebhookEvent) {
  if (alreadyProcessed(event)) {
    return { status: 200, body: { ok: true, deduped: true } };
  }
  try {
    return handleEvent(store, event);
  } catch (e: any) {
    return { status: 400, body: { error: e.message } };
  }
}
