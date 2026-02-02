import { Store } from "../src/store";
import { processWebhook } from "../src/index";
import { resetDedupe } from "../src/dedupe";

beforeEach(() => resetDedupe());

function makeOpened(deliveryId: string, pr: number) {
  return {
    deliveryId,
    name: "pull_request.opened",
    payload: {
      number: pr,
      pull_request: { id: 999999 }, // internal ID; should NOT be used
      repository: { full_name: "acme/repo" }
    }
  };
}

test("opened schedules a job for correct pr number", () => {
  const store = new Store();
  processWebhook(store, makeOpened("d1", 12));
  expect(store.jobs[0].prNumber).toBe(12);
});

test("dedupe prevents duplicate comments", () => {
  const store = new Store();
  processWebhook(store, makeOpened("d1", 12));
  processWebhook(store, makeOpened("d1", 12));
  expect(store.comments.length).toBe(1);
});

test("unknown events return 202 not 500", () => {
  const store = new Store();
  const res = processWebhook(store, { deliveryId: "x", name: "ping", payload: {} });
  expect(res.status).toBe(202);
});

test("missing deliveryId returns 400 not crash", () => {
  const store = new Store();
  const res = processWebhook(store, { deliveryId: "" as any, name: "ping", payload: {} });
  expect(res.status).toBe(400);
});

test("closed marks existing job closed", () => {
  const store = new Store();
  processWebhook(store, makeOpened("d1", 12));
  processWebhook(store, {
    deliveryId: "d2",
    name: "pull_request.closed",
    payload: { number: 12, repository: { full_name: "acme/repo" } }
  });

  expect(store.jobs[0].status).toBe("closed");
});
