export function createOptimisticMessage(message, userId) {
  const optId = `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  return {
    message,
    from: userId,
    createdAt: new Date().toISOString(),
    _optimisticId: optId,
    pending: true,
  };
}

export function mergeWithPending(serverMsgs, prev) {
  const server = Array.isArray(serverMsgs) ? serverMsgs : [];
  const pending = (Array.isArray(prev) ? prev : []).filter(m => m._optimisticId);
  if (!pending.length) return server;
  const extras = pending.filter(p =>
    !server.some(s =>
      s.message === p.message
      && String(s.from?._id || s.from) === String(p.from?._id || p.from)
    )
  );
  return [...server, ...extras];
}

export function removeOptimistic(prev, optId) {
  return prev.filter(m => m._optimisticId !== optId);
}
