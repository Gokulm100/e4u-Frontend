import React, { useState, useEffect, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AiTextArea from '../components/aiTextArea';

export default function PostAdPage() {
  const { user, apiFetch, navigate, showToast, categories, locations, pageExtra, fetchListings } = useApp();
  const editingAd = pageExtra.ad || null;

  const [title, setTitle] = useState(editingAd?.title || '');
  const [price, setPrice] = useState(editingAd?.price || '');
  const [description, setDescription] = useState(editingAd?.description || '');
  const [selectedCatId, setSelectedCatId] = useState('');
  const [selectedCatName, setSelectedCatName] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState('');
  const [locationQuery, setLocationQuery] = useState(editingAd?.location || '');
  const [locationDropdown, setLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState(editingAd?.images || []);
  const [submitting, setSubmitting] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [descInsights, setDescInsights] = useState({ total: 0, completed: 0, missing: 0, progress: 0, nextMissingLabel: '' });
  const fileRef = useRef(null);

  const filteredLocations = locations.filter(l =>
    l.name.toLowerCase().includes(locationQuery.toLowerCase())
  ).slice(0, 20);

  const resolveLocation = () => {
    if (selectedLocation?.name) return selectedLocation;
    const q = locationQuery.trim();
    if (!q) return null;
    const match = locations.find(l => l.name.toLowerCase() === q.toLowerCase());
    return match || { id: null, name: q };
  };

  useEffect(() => {
    if (!editingAd?.location || !locations.length) return;
    const match = locations.find(
      l => l.name === editingAd.location
        || l.name.toLowerCase() === editingAd.location.toLowerCase(),
    );
    if (match) {
      setSelectedLocation(match);
      setLocationQuery(match.name);
    } else {
      setLocationQuery(editingAd.location);
      setSelectedLocation({ id: null, name: editingAd.location });
    }
  }, [editingAd, locations]);

  useEffect(() => {
    if (editingAd) {
      const cat = categories.find(c => c.id === editingAd.categoryId || c.name === editingAd.category);
      if (cat) {
        setSelectedCatId(cat.id);
        setSelectedCatName(cat.name);
        setSubCategories(cat.subCategories || []);
        setSelectedSubCat(editingAd.subCategory || '');
      }
    }
  }, [editingAd, categories]);

  const handleCatClick = (cat) => {
    setSelectedCatId(cat.id);
    setSelectedCatName(cat.name);
    setSubCategories(cat.subCategories || []);
    setSelectedSubCat('');
  };

  const handleSubCatClick = (sub) => {
    const name = typeof sub === 'string' ? sub : sub.name;
    setSelectedSubCat(prev => prev === name ? '' : name);
  };

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files].slice(0, 8));
  };

  const removeImage = (i) => setImages(prev => prev.filter((_, idx) => idx !== i));
  const removeExisting = (i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  // Helper to animate text like a typewriter
  const animateDescription = (text) => {
    let i = 0;
    setDescription('');
    const interval = setInterval(() => {
      setDescription(prev => {
        if (i >= text.length) {
          clearInterval(interval);
          return prev;
        }
        i++;
        return text.slice(0, i);
      });
    }, 12); // Adjust speed as needed
  };

  const generateAiDescription = async () => {
    if (!title || !selectedCatName) { showToast('Please add a title and category first.', 'error'); return; }
    const loc = resolveLocation();
    if (!loc?.name) { showToast('Please select or enter a location first.', 'error'); return; }
    setAiLoading(true);
    try {
      const res = await apiFetch('/api/ads/generateDescriptionUsingAI', {
        method: 'POST',
        body: JSON.stringify({
          title,
          price: price || '',
          category: selectedCatName,
          subCategory: selectedSubCat || 'General',
          description: description || '',
          location: loc.name,
        }),
      });
      if (res.data) animateDescription(res.data);
    } catch { showToast('AI description failed.', 'error'); }
    finally { setAiLoading(false); }
  };

  const aiButtonLabel = (() => {
    if (aiLoading) return '...';
    return 'AI Write';
  })();

  const handleSubmit = async () => {
    if (!user) { showToast('Please sign in to post an ad.', 'error'); return; }
    if (!title.trim()) { showToast('Please enter a title.', 'error'); return; }
    if (!selectedCatId) { showToast('Please select a category.', 'error'); return; }
    if (!price) { showToast('Please enter a price.', 'error'); return; }
    const loc = resolveLocation();
    if (!loc?.name) { showToast('Please select a location.', 'error'); return; }
    if (description.length < 150) { showToast('Description must be at least 150 characters.', 'error'); return; }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', selectedCatId);
      if (selectedSubCat) formData.append('subCategory', selectedSubCat);
      formData.append('location', loc.name);
      if (existingImages.length) formData.append('existingImages', JSON.stringify(existingImages));
      images.forEach(img => formData.append('images', img));

      const token = localStorage.getItem('authToken');
      const url = editingAd
        ? `https://e4u-backend.onrender.com/api/ads/edit/${editingAd.id}`
        : 'https://e4u-backend.onrender.com/api/ads/postAdd';
      const method = editingAd ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Failed');
      showToast(editingAd ? 'Ad updated!' : 'Ad posted successfully!', 'success');
      fetchListings(1, true);
      navigate('my-ads');
    } catch { showToast(`Failed to ${editingAd ? 'update' : 'post'} ad.`, 'error'); }
    finally { setSubmitting(false); }
  };

  return (
    <div>
      <div className="page-title">{editingAd ? 'Edit Ad' : 'Post Ad'}</div>
      <div className="post-form">
        {!user && (
          <div className="login-warn">
            <AlertCircle size={16} /> You must be logged in to post an ad.
          </div>
        )}

        <div className="form-card">
          <label className="form-label">Title *</label>
          <input className="form-input" type="text" placeholder="e.g. iPhone 13 Pro Max" value={title} onChange={e => setTitle(e.target.value)} />

          <label className="form-label">Category *</label>
          <div className="pills-row" style={{ paddingBottom: 0 }}>
            {categories.map(cat => (
              <button key={cat.id} className={`pill${selectedCatId === cat.id ? ' active' : ''}`} onClick={() => handleCatClick(cat)}>
                {cat.name}
              </button>
            ))}
          </div>

          {subCategories.length > 0 && (
            <>
              <label className="form-label">Subcategory</label>
              <div className="pills-row" style={{ paddingBottom: 0 }}>
                {subCategories.map(sub => {
                  const name = typeof sub === 'string' ? sub : sub.name;
                  return (
                    <button key={name} className={`pill sub${selectedSubCat === name ? ' active' : ''}`} onClick={() => handleSubCatClick(sub)}>
                      {name}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <label className="form-label">Price (₹) *</label>
          <input className="form-input" type="number" placeholder="e.g. 15000" value={price} onChange={e => setPrice(e.target.value)} />

          <label className="form-label">Location *</label>
          <div className="location-dropdown">
            <input
              className="form-input"
              type="text"
              placeholder="Search city..."
              autoComplete="off"
              value={locationQuery}
              onChange={e => {
                const q = e.target.value;
                setLocationQuery(q);
                setLocationDropdown(true);
                const match = locations.find(l => l.name.toLowerCase() === q.trim().toLowerCase());
                setSelectedLocation(match || null);
              }}
              onFocus={() => setLocationDropdown(true)}
              onBlur={() => {
                setTimeout(() => {
                  setLocationDropdown(false);
                  const q = locationQuery.trim();
                  if (!q) return;
                  const match = locations.find(l => l.name.toLowerCase() === q.toLowerCase());
                  if (match) setSelectedLocation(match);
                }, 200);
              }}
            />
            {locationDropdown && filteredLocations.length > 0 && (
              <div className="location-list">
                {filteredLocations.map(loc => (
                  <div key={loc.id} className="location-item" onMouseDown={() => { setSelectedLocation(loc); setLocationQuery(loc.name); setLocationDropdown(false); }}>
                    {loc.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <label className="form-label">
            Description * <span className="char-count">({description.length}/150 min)</span>
          </label>
          <div className="ai-textarea-wrap">
            <AiTextArea
              value={description}
              onChange={e => setDescription(e.target.value)}
              category={selectedCatName}
              subcategory={selectedSubCat}
              onInsightsChange={setDescInsights}
            />
            <button className="ai-btn" onClick={generateAiDescription} disabled={aiLoading} type="button">
              <span>{aiButtonLabel}</span>
            </button>
          </div>

          <label className="form-label">Images (optional)</label>
          <button className="img-picker-btn" type="button" onClick={() => fileRef.current?.click()}>
            <Camera size={18} />
            <span>Add Photos ({images.length + existingImages.length}/8)</span>
          </button>
          <input type="file" ref={fileRef} accept="image/*" multiple style={{ display: 'none' }} onChange={handleImagePick} />

          <div className="img-preview-row">
            {existingImages.map((src, i) => (
              <div key={`ex-${i}`} className="img-preview-wrap">
                <img className="img-preview" src={src} alt="" />
                <button className="img-remove-btn" onClick={() => removeExisting(i)}>✕</button>
              </div>
            ))}
            {images.map((file, i) => (
              <div key={`new-${i}`} className="img-preview-wrap">
                <img className="img-preview" src={URL.createObjectURL(file)} alt="" />
                <button className="img-remove-btn" onClick={() => removeImage(i)}>✕</button>
              </div>
            ))}
          </div>
        </div>

        <button className="submit-btn" onClick={handleSubmit} disabled={submitting || !user}>
          {submitting ? 'Submitting...' : (editingAd ? 'Save Changes' : 'Post Ad')}
        </button>
      </div>
    </div>
  );
}
