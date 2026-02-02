const seen = new Set<any>();

export function alreadyProcessed(event: { deliveryId: string }) {
  const key = { id: event.deliveryId }; // BUG: new object each time, Set won't match
  if (seen.has(key)) return true;
  seen.add(key);
  return false;
}

export function resetDedupe() {
  seen.clear();
}
