import React, { useEffect, useState } from 'react';


// Field definitions for each category/subcategory
const FIELD_MAP = {
  Electronics: {
    DEFAULT: ['brand', 'model', 'condition', 'warranty', 'accessories', 'price'],
    Mobiles: ['brand', 'model', 'storage', 'battery', 'condition', 'warranty', 'accessories', 'color'],
    Mobile: ['brand', 'model', 'storage', 'battery', 'condition', 'warranty', 'accessories', 'color'],
    Tv: ['brand', 'size', 'type', 'screen', 'condition', 'warranty', 'accessories'],
    'Washing Machine': ['brand', 'type', 'capacity', 'condition', 'warranty', 'accessories'],
    Laptop: ['brand', 'model', 'processor', 'ram', 'storage', 'battery', 'condition'],
    Laptops: ['brand', 'model', 'processor', 'ram', 'storage', 'battery', 'condition'],
    Refrigerator: ['brand', 'capacity', 'type', 'condition', 'warranty'],
    'Air Conditioner': ['brand', 'capacity', 'type', 'condition', 'warranty'],
    Camera: ['brand', 'model', 'condition', 'accessories', 'warranty'],
    Tablet: ['brand', 'model', 'storage', 'condition', 'warranty'],
    Headphones: ['brand', 'type', 'condition', 'warranty', 'accessories'],
  },
  'Real Estate': {
    DEFAULT: ['location', 'area', 'furnishing', 'price', 'availability'],
    'House For Rent': ['location', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'rent', 'availability'],
    'House For Sale': ['location', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'price', 'owner'],
    'Plot For Rent': ['location', 'area', 'rent', 'availability'],
    'Plot For Sale': ['location', 'area', 'price', 'owner'],
    Apartment: ['location', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'price'],
    Villa: ['location', 'bedrooms', 'bathrooms', 'area', 'furnishing', 'price'],
    'Commercial Space': ['location', 'area', 'rent', 'price', 'availability'],
  },
  Vehicles: {
    DEFAULT: ['brand', 'model', 'year', 'mileage', 'condition', 'price'],
    Cars: ['brand', 'model', 'year', 'mileage', 'fuel', 'transmission', 'owner', 'insurance', 'condition'],
    Bikes: ['brand', 'model', 'year', 'mileage', 'fuel', 'owner', 'insurance', 'condition'],
    Scooters: ['brand', 'model', 'year', 'mileage', 'fuel', 'owner', 'condition'],
    'Other Vehicles': ['type', 'brand', 'model', 'year', 'condition', 'price'],
    'Other Vechicles': ['type', 'brand', 'model', 'year', 'condition', 'price'],
  },
  Games: {
    DEFAULT: ['title', 'platform', 'condition', 'price'],
    'Playstation Games': ['title', 'platform', 'condition', 'price'],
    'Xbox Games': ['title', 'platform', 'condition', 'price'],
    Controllers: ['type', 'brand', 'condition', 'accessories'],
    Controlers: ['type', 'brand', 'condition', 'accessories'],
    'Gaming Rig': ['cpu', 'gpu', 'ram', 'storage', 'condition', 'warranty'],
    Console: ['brand', 'model', 'storage', 'condition', 'accessories'],
  },
  Furniture: {
    DEFAULT: ['type', 'material', 'condition', 'dimensions', 'age', 'price'],
  },
  Fashion: {
    DEFAULT: ['brand', 'size', 'color', 'condition', 'age', 'price'],
  },
  Jobs: {
    DEFAULT: ['title', 'location', 'salary', 'experience', 'availability'],
  },
};

const FIELD_DEFS = {
  brand: { label: 'Brand', color: '#2563eb' },
  model: { label: 'Model', color: '#059669' },
  storage: { label: 'Storage', color: '#64748b' },
  battery: { label: 'Battery', color: '#16a34a' },
  condition: { label: 'Condition', color: '#a21caf' },
  warranty: { label: 'Warranty', color: '#0ea5e9' },
  accessories: { label: 'Accessories', color: '#f59e42' },
  color: { label: 'Color', color: '#f43f5e' },
  size: { label: 'Size', color: '#0f766e' },
  type: { label: 'Type', color: '#2563eb' },
  capacity: { label: 'Capacity', color: '#7c3aed' },
  screen: { label: 'Screen', color: '#1d4ed8' },
  processor: { label: 'Processor', color: '#334155' },
  location: { label: 'Location', color: '#2563eb' },
  bedrooms: { label: 'Bedrooms', color: '#059669' },
  bathrooms: { label: 'Bathrooms', color: '#64748b' },
  area: { label: 'Area', color: '#a21caf' },
  furnishing: { label: 'Furnishing', color: '#0ea5e9' },
  rent: { label: 'Rent', color: '#f59e42' },
  price: { label: 'Price', color: '#1d4ed8' },
  year: { label: 'Year', color: '#64748b' },
  mileage: { label: 'Mileage', color: '#a21caf' },
  fuel: { label: 'Fuel Type', color: '#0ea5e9' },
  transmission: { label: 'Transmission', color: '#f59e42' },
  owner: { label: 'Ownership', color: '#7c2d12' },
  insurance: { label: 'Insurance', color: '#0369a1' },
  title: { label: 'Title', color: '#2563eb' },
  platform: { label: 'Platform', color: '#059669' },
  cpu: { label: 'CPU', color: '#2563eb' },
  gpu: { label: 'GPU', color: '#059669' },
  ram: { label: 'RAM', color: '#64748b' },
  material: { label: 'Material', color: '#78350f' },
  dimensions: { label: 'Dimensions', color: '#166534' },
  age: { label: 'Age', color: '#6b7280' },
  salary: { label: 'Salary', color: '#15803d' },
  experience: { label: 'Experience', color: '#6d28d9' },
  availability: { label: 'Availability', color: '#ea580c' },
};

function getRequiredFieldDefs(category, subcategory) {
  const c = FIELD_MAP[category] ? category : 'Electronics';
  const catFields = FIELD_MAP[c] || {};
  const key = subcategory || 'DEFAULT';
  const fieldKeys = catFields[key] || catFields.DEFAULT || FIELD_MAP.Electronics.DEFAULT;
  return fieldKeys.map((k) => FIELD_DEFS[k]).filter(Boolean);
}


// Field presence checkers for each key
const FIELD_CHECKERS = {
  brand: text => /samsung|apple|xiaomi|oneplus|vivo|oppo|realme|nokia|motorola|google|sony|lg|brand/.test(text),
  model: text => /model|iphone|galaxy|pixel|note|pro|plus|ultra|edge|series|[a-z]{2,}\d{1,}/.test(text),
  storage: text => /\d+\s?gb|\d+\s?tb|storage/.test(text),
  condition: text => /new|used|like new|condition/.test(text),
  warranty: text => /warranty|guarantee/.test(text),
  accessories: text => /accessories|charger|box|earphones|case|cover/.test(text),
	size: text => /\d+\s?(inches|inch|")|size/.test(text),
  type: text => /type|led|lcd|oled|front load|top load|controller|gaming rig/.test(text),
  capacity: text => /\d+\s?kg|capacity/.test(text),
  location: text => /location|city|area|address/.test(text),
  bedrooms: text => /bedroom|bhk|room/.test(text),
  bathrooms: text => /bathroom|toilet|washroom/.test(text),
  area: text => /\d+\s?sqft|area|plot/.test(text),
  furnishing: text => /furnishing|furnished|unfurnished|semi-furnished/.test(text),
  rent: text => /rent|monthly|per month/.test(text),
  price: text => /price|rs|inr|lakh|crore|amount/.test(text),
  year: text => /\b(19|20)\d{2}\b|year/.test(text),
  mileage: text => /\d+\s?(km|kms|kilometers|mileage)/.test(text),
  fuel: text => /fuel|petrol|diesel|cng|electric/.test(text),
  transmission: text => /transmission|manual|automatic/.test(text),
  title: text => /title|game|playstation|ps4|ps5/.test(text),
  platform: text => /platform|console|ps4|ps5|xbox|pc/.test(text),
  cpu: text => /cpu|processor|i3|i5|i7|i9|ryzen/.test(text),
  gpu: text => /gpu|graphics|nvidia|amd|rtx|gtx/.test(text),
  ram: text => /ram|memory|gb/.test(text),
  color: text => /color|red|blue|green|black|white|yellow|pink|purple|orange|silver|gold/.test(text),
  battery: text => /battery|mah|battery health|backup|hours/.test(text),
  screen: text => /screen|display|resolution|4k|hd|uhd/.test(text),
  processor: text => /processor|chip|snapdragon|mediatek|intel|amd|m1|m2/.test(text),
  owner: text => /owner|first owner|1st owner|second owner|single owner/.test(text),
  insurance: text => /insurance|comprehensive|third party|valid till/.test(text),
  material: text => /material|wood|metal|plastic|leather|fabric/.test(text),
  dimensions: text => /dimension|length|width|height|inch|cm|ft/.test(text),
  age: text => /age|year old|months old|used for/.test(text),
  salary: text => /salary|ctc|lpa|per annum|package/.test(text),
  experience: text => /experience|fresher|years|yr/.test(text),
  availability: text => /available|immediate|possession|move in|vacant/.test(text),
};

const FIELD_TEMPLATES = {
  brand: 'Brand: ',
  model: 'Model: ',
  storage: 'Storage: ',
  condition: 'Condition: ',
  warranty: 'Warranty: ',
  accessories: 'Accessories included: ',
  size: 'Size: ',
  type: 'Type: ',
  capacity: 'Capacity: ',
  location: 'Location: ',
  bedrooms: 'Bedrooms: ',
  bathrooms: 'Bathrooms: ',
  area: 'Area: ',
  furnishing: 'Furnishing: ',
  rent: 'Rent: ',
  price: 'Price: ',
  year: 'Year: ',
  mileage: 'Mileage: ',
  fuel: 'Fuel type: ',
  transmission: 'Transmission: ',
  title: 'Title: ',
  platform: 'Platform: ',
  cpu: 'CPU: ',
  gpu: 'GPU: ',
  ram: 'RAM: ',
  color: 'Color: ',
  battery: 'Battery health: ',
  screen: 'Screen details: ',
  processor: 'Processor: ',
  owner: 'Ownership: ',
  insurance: 'Insurance status: ',
  material: 'Material: ',
  dimensions: 'Dimensions: ',
  age: 'Age: ',
  salary: 'Salary: ',
  experience: 'Experience required: ',
  availability: 'Availability: ',
};

const FIELD_EXAMPLES = {
  brand: 'e.g. Samsung, Apple',
  model: 'e.g. iPhone 13, Galaxy S21',
  condition: 'e.g. Like new, no scratches',
  warranty: 'e.g. 6 months remaining',
  accessories: 'e.g. Box + charger included',
  storage: 'e.g. 128GB',
  size: 'e.g. 55 inches',
  year: 'e.g. 2021',
  mileage: 'e.g. 42,000 km',
  fuel: 'e.g. Petrol',
  transmission: 'e.g. Automatic',
  rent: 'e.g. Rs 15,000/month',
  price: 'e.g. Rs 45,000',
  battery: 'e.g. 88% battery health',
  screen: 'e.g. 6.5-inch AMOLED',
  processor: 'e.g. i5 12th Gen',
  owner: 'e.g. First owner',
  insurance: 'e.g. Valid till Jan 2027',
  material: 'e.g. Solid wood',
  dimensions: 'e.g. 6ft x 4ft',
  age: 'e.g. 1 year old',
  salary: 'e.g. 4.5 LPA',
  experience: 'e.g. 2+ years',
  availability: 'e.g. Immediate',
};

function getCaretPosition(textarea, cursorPos) {
  const div = document.createElement('div');
  const style = window.getComputedStyle(textarea);
  const props = [
    'boxSizing', 'width', 'height', 'overflowX', 'overflowY', 'borderTopWidth', 'borderRightWidth',
    'borderBottomWidth', 'borderLeftWidth', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'fontStyle', 'fontVariant', 'fontWeight', 'fontStretch', 'fontSize', 'fontSizeAdjust', 'lineHeight',
    'fontFamily', 'textAlign', 'textTransform', 'textIndent', 'textDecoration', 'letterSpacing', 'wordSpacing',
    'tabSize', 'MozTabSize',
  ];
  props.forEach((prop) => { div.style[prop] = style[prop]; });

  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.whiteSpace = 'pre-wrap';
  div.style.wordWrap = 'break-word';
  div.style.left = '-9999px';

  div.textContent = textarea.value.substring(0, cursorPos);
  const span = document.createElement('span');
  span.textContent = textarea.value.substring(cursorPos) || '.';
  div.appendChild(span);
  document.body.appendChild(div);

  const top = span.offsetTop - textarea.scrollTop;
  const left = span.offsetLeft - textarea.scrollLeft;
  document.body.removeChild(div);
  return { top, left };
}

function checkFieldPresent(text, field) {
  const lower = (text || '').toLowerCase();
  const checker = FIELD_CHECKERS[field.key];
  return checker ? checker(lower) : false;
}


// Accept category and subcategory as props
const AiTextArea = ({ value, onChange, category, subcategory, onInsightsChange }) => {
	const [touched, setTouched] = useState(false);
  const [showTypingTip, setShowTypingTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [tipPos, setTipPos] = useState({ top: 8, left: 8 });
  const [tipPinnedTop, setTipPinnedTop] = useState(false);
  const textareaRef = React.useRef(null);
	const requiredFields = getRequiredFieldDefs(category, subcategory);
	const completedFields = requiredFields.filter(f => checkFieldPresent(value || '', f));
	const missingFields = requiredFields.filter(f => !checkFieldPresent(value || '', f));
	const progress = Math.round((completedFields.length / requiredFields.length) * 100);
	const nextMissing = missingFields[0];

	const handleChange = e => {
		setTouched(true);
    if (textareaRef.current) {
      const cursorPos = e.target.selectionStart || 0;
      try {
        const { top, left } = getCaretPosition(textareaRef.current, cursorPos);
        setTipPos({ top: Math.max(6, top - 34), left: Math.max(10, left + 14) });
        setTipPinnedTop(top < 38);
      } catch {
        setTipPos({ top: 8, left: 8 });
        setTipPinnedTop(false);
      }
    }
		onChange && onChange(e);
	};

  React.useEffect(() => {
    onInsightsChange && onInsightsChange({
      total: requiredFields.length,
      completed: completedFields.length,
      missing: missingFields.length,
      progress,
      nextMissingLabel: nextMissing?.label || '',
    });
  }, [requiredFields.length, completedFields.length, missingFields.length, progress, nextMissing?.label, onInsightsChange]);

  useEffect(() => {
    setTipIndex(0);
  }, [category, subcategory]);

  useEffect(() => {
    if (!touched || missingFields.length === 0) {
      setShowTypingTip(false);
      return undefined;
    }
    setShowTypingTip(false);
    const debounce = setTimeout(() => setShowTypingTip(true), 650);
    return () => clearTimeout(debounce);
  }, [value, touched, missingFields.length]);

  useEffect(() => {
    if (!showTypingTip || missingFields.length <= 1) return undefined;
    const rotate = setInterval(() => {
      setTipIndex(prev => (prev + 1) % missingFields.length);
    }, 3500);
    return () => clearInterval(rotate);
  }, [showTypingTip, missingFields.length]);

  const addTemplate = (field) => {
    const template = FIELD_TEMPLATES[field.key] || `${field.label}: `;
    const text = value || '';
    if (text.toLowerCase().includes(template.toLowerCase())) return;
    const next = text.trim() ? `${text.trim()}\n${template}` : template;
    setTouched(true);
    setShowTypingTip(false);
    onChange && onChange({ target: { value: next } });
  };

  const activeTipField = missingFields[Math.min(tipIndex, Math.max(missingFields.length - 1, 0))];

		return (
			<div style={{  maxWidth: 520, background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: 18, border: '1px solid #f1f5f9' }}>
				<div style={{ marginBottom: 10 }}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          </div>
				</div>
            <div style={{ position: 'relative' }}>
				   <textarea
              ref={textareaRef}
					   value={value}
					   onChange={handleChange}
					   rows={6}
					   style={{
						   width: '-webkit-fill-available',
						   fontSize: 15,
						   fontFamily: 'inherit',
						   borderColor: missingFields.length && touched ? '#e11d48' : '#e5e7eb',
						   borderRadius: 7,
						   outline: 'none',
						   boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
						   marginBottom: 6,
						   background: '#f8fafc',
						   minHeight: 100,
						   resize: 'vertical',
						   transition: 'border-color 0.2s',
						   padding: '12px 12px 12px 22px'
					   }}
					   placeholder={`Describe your ${subcategory || category || 'item'} in detail...`}
				   />
          {showTypingTip && activeTipField && (
            <div style={{
              position: 'absolute',
              top: tipPinnedTop ? 8 : tipPos.top,
              left: tipPinnedTop ? 12 : tipPos.left,
              maxWidth: 270,
              zIndex: 3,
              padding: '10px 11px',
              background: '#fffef7',
              border: '1px solid #f8e7a3',
              borderRadius: 12,
              color: '#3f3a22',
              fontSize: 12,
              fontWeight: 500,
              lineHeight: 1.35,
              boxShadow: '0 8px 18px rgba(146, 118, 38, 0.12)',
              pointerEvents: 'none',
              opacity: 1,
              transform: 'translateY(0)',
              animation: 'tipFadeIn 180ms ease-out',
            }}>
              <style>{`
                @keyframes tipFadeIn {
                  from {
                    opacity: 0;
                    transform: translateY(8px) scale(0.98);
                  }
                  to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                  }
                }
              `}</style>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <span style={{ fontSize: 13 }}>💡</span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 0.2,
                  color: '#7c5a10',
                  textTransform: 'uppercase',
                }}>
                  Suggestion
                </span>
              </div>
              Add <strong>{activeTipField.label}</strong> {FIELD_EXAMPLES[activeTipField.key] || 'to improve listing quality'}.
            </div>
          )}
          </div>
                                    				<div style={{ marginTop: 6 }}>
					{touched && missingFields.length > 0 && (
						<div style={{ color: '#4c64efff',padding:'5px' ,marginBottom: 4, textAlign: 'left', fontWeight: 500, fontSize: 13 }}>
																							<span style={{ fontSize: 15, color: '#fbbf24', marginTop: 1, display: 'inline-flex', alignItems: 'center' }} aria-label="tip" title="Tip">
																	{/* Bulb icon SVG */}
																	<svg width="1em" height="1em" viewBox="0 0 20 20" fill="currentColor" style={{ display: 'inline', verticalAlign: 'middle' }}><path d="M10 2a6 6 0 0 0-3.98 10.47c.13.12.21.29.21.47v.06c0 .28.22.5.5.5h6.54c.28 0 .5-.22.5-.5v-.06c0-.18.08-.35.21-.47A6 6 0 0 0 10 2zm-2 14a1 1 0 1 0 4 0h-4z"/></svg>
																</span>
                            Consider adding: {missingFields.map(f => f.label).join(', ')}
						</div>
					)}
          {!touched && nextMissing && (
            <div style={{ color: '#334155', padding: '5px', marginBottom: 4, fontWeight: 500, fontSize: 13 }}>
              Tip: Start with <strong>{nextMissing.label}</strong> for better visibility.
            </div>
          )}

				</div>
<div style={{ display: 'flex', flexWrap: 'wrap',paddingTop: 6,paddingBottom: 6, gap: 6, marginBottom: 6 }}>
						{requiredFields.map(f => (
							<button type="button" key={f.key} onClick={() => addTemplate(f)} style={{
								display: 'inline-flex',
								alignItems: 'center',
								padding: '2px 9px',
								borderRadius: 12,
								background: checkFieldPresent(value || '', f) ? f.color : '#f3f4f6',
								color: checkFieldPresent(value || '', f) ? '#fff' : '#6b7280',
								fontWeight: 500,
								fontSize: 12,
								border: checkFieldPresent(value || '', f) ? 'none' : `1px solid ${f.color}`,
								opacity: checkFieldPresent(value || '', f) ? 1 : 0.7,
								marginBottom: 2,
								transition: 'all 0.2s',
                cursor: 'pointer'
							}}>
								{f.label}
								{checkFieldPresent(value || '', f) ? <span style={{ marginLeft: 4, fontSize: 13 }}>✓</span> : null}
							</button>
						))}
					</div>
                    					<div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
						<div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#22c55e' : '#2563eb', transition: 'width 0.3s' }} />
					</div>
			</div>
            
		);
};

export default AiTextArea;
