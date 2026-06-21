const API = process.env.REACT_APP_API_BASE_URL || 'https://e4u-backend.onrender.com';

// Sends a chat message with an image attachment via multipart/form-data.
// `message` is optional and can accompany the image.
export async function uploadChatImage({ adId, from, to, file, message = '' }) {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('adId', adId);
  formData.append('from', from);
  formData.append('to', to);
  if (message) formData.append('message', message);
  formData.append('image', file);

  const res = await fetch(`${API}/api/ads/chat`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}
