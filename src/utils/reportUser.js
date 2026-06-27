export function getChatReportTargetId({ buyerId, sellerId }, isSeller) {
  return isSeller ? buyerId : sellerId;
}

export async function confirmAndReportUser({
  apiFetch,
  showToast,
  buyerId,
  sellerId,
  isSeller,
  targetName,
}) {
  const targetId = getChatReportTargetId({ buyerId, sellerId }, isSeller);
  if (!targetId) return;

  const label = targetName ? `"${targetName}"` : 'this user';
  if (!window.confirm(`Report ${label} for suspicious activity?`)) return;

  try {
    await apiFetch('/api/users/reportUser', {
      method: 'POST',
      body: JSON.stringify({ userId: targetId }),
    });
    showToast('Thank you for reporting. We will investigate this user.', 'success');
  } catch (err) {
    showToast(err?.message || 'Failed to report user. Please try again.', 'error');
  }
}
