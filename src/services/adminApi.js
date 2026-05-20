/**
 * Admin API — expects backend routes under /api/admin (admin JWT required).
 * Adjust paths here if your backend uses different names.
 */
const ADMIN = '/api/admin';

function normalizeList(res, keys = ['data', 'users', 'reports', 'items', 'results']) {
  if (Array.isArray(res)) return res;
  for (const key of keys) {
    if (Array.isArray(res?.[key])) return res[key];
  }
  return [];
}

export function mapAdminUser(raw) {
  return {
    id: raw._id || raw.id,
    name: raw.name || 'Unknown',
    email: raw.email || '',
    profilePic: raw.profilePic || null,
    isActive: raw.isActive !== false,
    isAdmin: !!raw.isAdmin,
    createdAt: raw.createdAt || null,
    reportCounter: raw.reportCounter ?? 0,
  };
}

export function mapAdminReport(raw) {
  const reporter = raw.reporter || raw.reportedBy || {};
  const target = raw.reportedUser || raw.targetUser || raw.user || {};
  const ad = raw.ad || raw.adId || {};
  return {
    id: raw._id || raw.id,
    reason: raw.reason || raw.type || 'Report',
    description: raw.description || raw.message || raw.details || '',
    status: raw.status || 'pending',
    createdAt: raw.createdAt || null,
    reporterId: reporter._id || reporter.id || raw.reporterId,
    reporterName: reporter.name || raw.reporterName || 'Unknown',
    reporterEmail: reporter.email || raw.reporterEmail || '',
    targetUserId: target._id || target.id || raw.reportedUserId || raw.targetUserId,
    targetUserName: target.name || raw.reportedUserName || 'Unknown',
    targetUserEmail: target.email || '',
    adId: ad._id || ad.id || (typeof raw.adId === 'string' ? raw.adId : null),
    adTitle: ad.title || raw.adTitle || '',
  };
}

export async function fetchAdminUsers(apiFetch) {
  const res = await apiFetch(`${ADMIN}/getUsers`, { method: 'POST', body: JSON.stringify({}) });
  return normalizeList(res, ['data', 'users']).map(mapAdminUser);
}

export async function setUserActive(apiFetch, userId, isActive) {
  return apiFetch(`${ADMIN}/setUserActive`, {
    method: 'POST',
    body: JSON.stringify({ userId, isActive }),
  });
}

export async function fetchAdminReports(apiFetch, status = 'pending') {
  const res = await apiFetch(`${ADMIN}/getReports`, {
    method: 'POST',
    body: JSON.stringify({ status: status === 'all' ? undefined : status }),
  });
  return normalizeList(res, ['data', 'reports']).map(mapAdminReport);
}

export async function updateReportStatus(apiFetch, reportId, status, adminNote = '') {
  return apiFetch(`${ADMIN}/updateReport`, {
    method: 'POST',
    body: JSON.stringify({ reportId, status, adminNote }),
  });
}

export async function fetchPendingReportCount(apiFetch) {
  try {
    const reports = await fetchAdminReports(apiFetch, 'pending');
    return reports.filter(r => r.status === 'pending').length;
  } catch {
    return 0;
  }
}
