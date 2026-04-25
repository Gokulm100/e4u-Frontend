import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const API = 'https://e4u-backend.onrender.com';
const LIMIT = 10;

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [hasConsented, setHasConsented] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user'))?.hasConsented || false; } catch { return false; }
  });

  const [currentPage, setCurrentPage] = useState('home');
  const [pageExtra, setPageExtra] = useState({});

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [messageCount, setMessageCount] = useState(0);
  const [locations, setLocations] = useState([]);

  const [toast, setToast] = useState([]);
  const [modal, setModal] = useState(null);

  // API helper
  const apiFetch = useCallback(async (path, opts = {}) => {
    const t = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}), ...opts.headers };
    const res = await fetch(`${API}${path}`, { ...opts, headers });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || `HTTP ${res.status}`); }
    return res.json();
  }, []);

  const showToast = useCallback((msg, type = '') => {
    const id = Date.now();
    setToast(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToast(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const showModal = useCallback((title, sub, icon, onConfirm) => {
    setModal({ title, sub, icon, onConfirm });
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const navigate = useCallback((page, extra = {}) => {
    setCurrentPage(page);
    setPageExtra(extra);
    window.scrollTo(0, 0);
  }, []);

  const login = useCallback((tkn, usr) => {
    localStorage.setItem('user', JSON.stringify(usr));
    setUser(usr);
    setHasConsented(usr.hasConsented || false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setHasConsented(false);
  }, []);

  const mapListing = (item) => ({
    id: item._id,
    title: item.title || '',
    price: item.price || 0,
    images: item.images?.length ? item.images : ['https://images.pexels.com/photos/10703759/pexels-photo-10703759.jpeg'],
    category: item.category?.name || item.category || 'General',
    categoryId: item.category?._id || item.categoryId || '',
    subCategory: item.subCategoryId?.name || item.subCategory || '',
    location: item.location?.name || item.location || '',
    views: item.views || 0,
    posted: item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    description: item.description || '',
    seller: item.seller?.name || item.sellerName || 'Unknown',
    sellerPic: item.seller?.profilePic || item.sellerPic || null,
    sellerId: item.seller?._id || item.sellerId || '',
    status: item.status || 'active',
    isActive:item.isActive == false ? false : true,
  });

  const fetchListings = useCallback(async (pageNum = 1, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const catObj = categories.find(c => c.name === selectedCategory);
      const result = await apiFetch('/api/ads', {
        method: 'POST',
        body: JSON.stringify({
          page: pageNum, limit: LIMIT,
          search: searchQuery || undefined,
          category: selectedCategory !== 'All' ? catObj?.id : undefined,
          subCategory: selectedSubCategory || undefined,
          userId: user?._id || undefined,
        }),
      });
      const data = result?.ads || [];
      const mapped = data.map(mapListing);
      setHasMore(data.length >= LIMIT);
      setListings(prev => (reset || pageNum === 1) ? mapped : [...prev, ...mapped]);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, categories, selectedCategory, selectedSubCategory, searchQuery, user, apiFetch]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await apiFetch('/api/ads/listCategories');
      const cats = Array.isArray(res) ? res : (res.data || []);
      setCategories(cats.map(c => ({ id: c._id, name: c.name, subCategories: c.subCategory || [] })));
    } catch { /* ignore */ }
  }, [apiFetch]);

  const fetchLocations = useCallback(async () => {
    try {
        const res = await apiFetch('/api/users/locations');
      const data = Array.isArray(res) ? res : (res.data || []);
      if (Array.isArray(data)) setLocations(data.map(c => ({ id: c._id, name: c.name })));
    } catch { /* ignore */ }
  }, []);

  const fetchMessageCount = useCallback(async () => {
    const storedToken = localStorage.getItem('authToken');
    console.log('Fetching message count with token:', storedToken);
    if (!storedToken) return;
    try {
      const res = await apiFetch('/api/ads/getBuyingMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        })
      const buying = Array.isArray(res?.filteredMessages) ? res.filteredMessages : [];
      const res2 = await apiFetch('/api/ads/getSellingMessages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedToken}`
        },
        },
           );
      const selling = Array.isArray(res2?.filteredMessages) ? res2.filteredMessages : [];
      const count = [...buying, ...selling].filter(c => c.isSeen === false).length;
      setMessageCount(count);
    } catch { /* ignore */ }
  }, [apiFetch]);

  useEffect(() => {
    fetchCategories();
    fetchLocations();
  }, [fetchCategories, fetchLocations]);

  useEffect(() => {
    fetchListings(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (user) {
      fetchMessageCount();
      const interval = setInterval(fetchMessageCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user, fetchMessageCount]);

  return (
    <AppContext.Provider value={{
      API, LIMIT,
      user, token, hasConsented, setHasConsented,
      currentPage, pageExtra, navigate,
      categories, selectedCategory, setSelectedCategory,
      selectedCategoryId, setSelectedCategoryId,
      subCategories, setSubCategories,
      selectedSubCategory, setSelectedSubCategory,
      searchQuery, setSearchQuery,
      listings, setListings, page, setPage, hasMore, loading,
      messageCount, fetchMessageCount,
      locations,
      apiFetch, mapListing,
      fetchListings,
      login, logout,
      showToast, showModal, modal, closeModal,
      toast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
