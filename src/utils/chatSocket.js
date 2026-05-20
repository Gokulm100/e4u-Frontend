export function normalizeId(id) {
  if (id == null || id === '') return '';
  if (typeof id === 'object') {
    return String(id._id || id.id || id);
  }
  return String(id);
}

export function toChatKey({ adId, buyerId, sellerId }) {
  return `${normalizeId(adId)}-${normalizeId(buyerId)}-${normalizeId(sellerId)}`;
}

export function parseChatPayload(payload) {
  const root = payload || {};
  const nested = [root.chat, root.data, root.payload, root.msg, root.lastMessage]
    .find(v => v && typeof v === 'object' && !Array.isArray(v));
  const p = nested || root;

  const messageText = typeof p.message === 'string'
    ? p.message
    : typeof root.message === 'string'
      ? root.message
      : (p.text || p.body || p.content || '');

  return {
    _id: p._id || root._id,
    adId: normalizeId(
      p.adId || p.ad?._id || p.ad
      || root.adId || root.ad?._id || root.ad
      || p.ad_id || root.ad_id,
    ),
    buyerId: normalizeId(
      p.buyerId || p.buyer?._id || p.buyer
      || root.buyerId || root.buyer?._id || root.buyer
      || p.buyer_id || root.buyer_id,
    ),
    sellerId: normalizeId(
      p.sellerId || p.seller?._id || p.seller
      || root.sellerId || root.seller?._id || root.seller
      || p.seller_id || root.seller_id,
    ),
    message: messageText,
    from: normalizeId(p.from?._id || p.from || root.from?._id || root.from || p.sender || root.sender),
    createdAt: p.createdAt || root.createdAt || p.timestamp || root.timestamp || new Date().toISOString(),
  };
}

export function payloadToMessage(parsed) {
  return {
    _id: parsed._id,
    message: parsed.message,
    from: parsed.from,
    createdAt: parsed.createdAt,
  };
}

export function payloadMatchesChat(payload, chatInfo) {
  if (!chatInfo?.adId) return false;
  const parsed = parseChatPayload(payload);
  if (!parsed.adId) return false;
  return toChatKey(parsed) === toChatKey(chatInfo);
}

export function payloadMatchesAd(payload, adId) {
  const parsed = parseChatPayload(payload);
  return normalizeId(parsed.adId) === normalizeId(adId);
}

export function appendIncomingMessage(prev, incoming) {
  if (!incoming?.message) return prev;
  const fromId = normalizeId(incoming.from);
  const exists = prev.some(m => {
    if (incoming._id && m._id && m._id === incoming._id) return true;
    const mFrom = normalizeId(m.from?._id || m.from);
    return m.message === incoming.message
      && mFrom === fromId
      && !m._optimisticId
      && Math.abs(new Date(m.createdAt) - new Date(incoming.createdAt)) < 10000;
  });
  if (exists) return prev;
  return [...prev, incoming];
}

export function patchConversationList(list, parsed, userId, isBuyingTab, fromMe) {
  const key = toChatKey(parsed);
  let found = false;
  const updated = list.map(item => {
    const buyerId = item.buyerId || item.buyer?._id || (isBuyingTab ? userId : null);
    const sellerId = item.sellerId || item.seller?._id || (!isBuyingTab ? userId : null);
    const adId = item.adId?._id || item.adId || item.ad?._id;
    if (toChatKey({ adId, buyerId, sellerId }) !== key) return item;
    found = true;
    return {
      ...item,
      lastMessage: { message: parsed.message, from: parsed.from, createdAt: parsed.createdAt },
      updatedAt: parsed.createdAt,
      isSeen: fromMe ? item.isSeen : false,
    };
  });
  return { list: updated, found };
}
