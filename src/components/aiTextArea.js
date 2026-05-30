import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';


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
  return fieldKeys
    .filter((k) => FIELD_DEFS[k])
    .map((k) => ({ key: k, ...FIELD_DEFS[k] }));
}

const BRAND_KEYWORDS = {
  mobiles: [
    'samsung', 'apple', 'iphone', 'xiaomi', 'redmi', 'poco', 'mi', 'oneplus', 'one plus',
    'vivo', 'oppo', 'realme', 'nokia', 'motorola', 'moto', 'google', 'pixel', 'sony',
    'asus', 'infinix', 'tecno', 'lava', 'micromax', 'honor', 'nothing', 'iqoo', 'lenovo',
    'htc', 'blackberry', 'gionee', 'coolpad', 'alcatel', 'huawei', 'zte', 'leeco', 'itel',
  ],
  computers: [
    'dell', 'hp', 'lenovo', 'asus', 'acer', 'apple', 'macbook', 'msi', 'microsoft',
    'surface', 'samsung', 'lg', 'gigabyte', 'razer', 'alienware', 'hcl', 'toshiba',
    'fujitsu', 'vaio', 'intel', 'amd', 'nvidia',
  ],
  tv: [
    'samsung', 'lg', 'sony', 'panasonic', 'tcl', 'mi', 'xiaomi', 'oneplus', 'vu', 'onida',
    'videocon', 'philips', 'hisense', 'toshiba', 'sansui', 'blaupunkt', 'kodak', 'thomson',
    'akai', 'intex', 'bpl', 'sanyo', 'lloyd', 'realme', 'motorola', 'nokia', 'acer',
  ],
  appliances: [
    'lg', 'samsung', 'whirlpool', 'ifb', 'bosch', 'haier', 'godrej', 'voltas', 'blue star',
    'daikin', 'hitachi', 'panasonic', 'sanyo', 'lloyd', 'carrier', 'mitsubishi', 'o general',
    'electrolux', 'kelvinator', 'videocon', 'onida', 'siemens', 'kenstar', 'crompton',
    'bajaj', 'havells', 'usha', 'orient', 'symphony', 'morphy richards', 'prestige', 'pigeon',
  ],
  camera: [
    'canon', 'nikon', 'sony', 'fujifilm', 'panasonic', 'olympus', 'gopro', 'dji', 'leica',
    'pentax', 'sigma', 'kodak', 'lumix', 'insta360',
  ],
  audio: [
    'sony', 'bose', 'jbl', 'boat', 'sennheiser', 'skullcandy', 'beats', 'marshall', 'noise',
    'boult', 'realme', 'oneplus', 'samsung', 'apple', 'airpods', 'jabra', 'soundcore',
    'philips', 'zebronics', 'portronics', 'ambrane',
  ],
  cars: [
    'maruti', 'suzuki', 'hyundai', 'tata', 'mahindra', 'toyota', 'honda', 'kia', 'ford',
    'renault', 'nissan', 'volkswagen', 'vw', 'skoda', 'mg', 'jeep', 'bmw', 'mercedes',
    'benz', 'audi', 'volvo', 'jaguar', 'datsun', 'fiat', 'chevrolet', 'isuzu', 'citroen',
    'lexus', 'land rover', 'porsche', 'mini', 'ssangyong', 'force', 'premier', 'ambassador',
    'mitsubishi', 'opel', 'tesla', 'byd',
  ],
  bikes: [
    'hero', 'honda', 'bajaj', 'tvs', 'yamaha', 'royal enfield', 'enfield', 'ktm', 'suzuki',
    'kawasaki', 'jawa', 'harley', 'harley davidson', 'triumph', 'ducati', 'aprilia', 'vespa',
    'ather', 'ola', 'revolt', 'benelli', 'hero electric', 'bgauss', 'okinawa', 'ampere',
    'tork', 'yezdi', 'husqvarna', 'kymco', 'mahindra', 'bmw', 'cfmoto',
  ],
  fashion: [
    'nike', 'adidas', 'puma', 'reebok', 'levis', "levi's", 'zara', 'h&m', 'gucci', 'prada',
    'woodland', 'bata', 'allen solly', 'peter england', 'van heusen', 'louis philippe',
    'raymond', 'fastrack', 'titan', 'fossil', 'tommy hilfiger', 'jack & jones', 'us polo',
    'wrangler', 'lee', 'biba', 'fabindia', 'max', 'lifestyle', 'gap', 'uniqlo',
    'calvin klein', 'armani', 'versace', 'ray-ban', 'rayban', 'crocs', 'sketchers', 'skechers',
  ],
  gaming: [
    'sony', 'playstation', 'microsoft', 'xbox', 'nintendo', 'steam', 'valve', 'logitech',
    'razer', 'rog', 'msi', 'dualshock', 'dualsense', 'redgear', 'cosmic byte',
  ],
};

const BRAND_REGEX = new RegExp(
  '\\b(' +
    [...new Set(Object.values(BRAND_KEYWORDS).flat())].join('|') +
    '|brand)\\b',
);

const FIELD_CHECKERS = {
  brand: t => BRAND_REGEX.test(t),
  model: t => /\b(model|iphone|galaxy|pixel|note|pro|plus|ultra|edge|series|swift|baleno|dzire|wagonr|alto|celerio|brezza|ertiga|ciaz|creta|venue|verna|santro|aura|nexon|harrier|safari|tiago|tigor|punch|altroz|scorpio|thar|bolero|city|amaze|jazz|civic|wrv|seltos|sonet|carens|fortuner|innova|glanza|fronx|polo|vento|virtus|taigun|kushaq|slavia|rapid|kwid|triber|kiger|duster|magnite|splendor|passion|glamour|pulsar|platina|avenger|apache|jupiter|ntorq|raider|fascino|classic|bullet|hunter|meteor|himalayan|duke|access|activa|dio|shine|unicorn)\b|[a-z]{2,}\s?\d{2,}/.test(t),
  storage: t => /\b(\d+\s?(gb|tb)|storage|rom|internal memory)\b/.test(t),
  condition: t => /\b(brand new|like new|gently used|barely used|new|used|condition|mint|excellent|good|fair|scratch)\b/.test(t),
  warranty: t => /\b(warranty|guarantee|warrant)\b/.test(t),
  accessories: t => /\b(accessories|charger|adapter|box|earphones|headphones|case|cover|cable|original box|bill)\b/.test(t),
  size: t => /\b(\d+\s?(inch|inches|"|cm)|size)\b/.test(t),
  type: t => /\b(type|led|lcd|oled|qled|smart tv|front load|top load|semi automatic|fully automatic|controller|gaming rig)\b/.test(t),
  capacity: t => /\b(\d+\s?(kg|kgs|litre|liter|l)|capacity)\b/.test(t),
  location: t => /\b(location|city|area|address|near|locality|sector|colony|nagar|road|pincode|landmark)\b/.test(t),
  bedrooms: t => /\b(\d+\s?(bhk|bedroom|bedrooms|rk)|bedroom|bhk|room)\b/.test(t),
  bathrooms: t => /\b(bathroom|bathrooms|toilet|washroom|attached bath)\b/.test(t),
  area: t => /\b(\d+\s?(sqft|sq ft|square feet|sqyd|sq yards|acre|cent)|area|carpet|built up|plot)\b/.test(t),
  furnishing: t => /\b(furnishing|furnished|unfurnished|semi.?furnished|fully furnished)\b/.test(t),
  rent: t => /\b(rent|monthly|per month|deposit|advance)\b/.test(t),
  price: t => /\b(price|rs|inr|₹|rupees|lakh|lakhs|crore|cr|negotiable|fixed|amount|cost)\b|\d{4,}/.test(t),
  year: t => /\b((19|20)\d{2}|year|registration year)\b/.test(t),
  mileage: t => /\b(\d+\s?(km|kms|kilometers|kmpl|mileage)|odometer|driven)\b/.test(t),
  fuel: t => /\b(fuel|petrol|diesel|cng|lpg|electric|ev|hybrid)\b/.test(t),
  transmission: t => /\b(transmission|manual|automatic|amt|cvt|dct|gear)\b/.test(t),
  title: t => /\b(title|game|playstation|ps4|ps5|xbox|edition)\b/.test(t),
  platform: t => /\b(platform|console|ps4|ps5|xbox|pc|nintendo|switch)\b/.test(t),
  cpu: t => /\b(cpu|processor|i3|i5|i7|i9|ryzen|core|intel|amd)\b/.test(t),
  gpu: t => /\b(gpu|graphics|nvidia|amd|rtx|gtx|radeon|geforce)\b/.test(t),
  ram: t => /\b(\d+\s?gb\s?ram|ram|memory|ddr)\b/.test(t),
  color: t => /\b(colou?r|red|blue|green|black|white|yellow|pink|purple|orange|grey|gray|silver|gold|midnight|brown|maroon)\b/.test(t),
  battery: t => /\b(battery|mah|battery health|backup|hours)\b/.test(t),
  screen: t => /\b(screen|display|resolution|4k|hd|uhd|amoled|lcd|inch)\b/.test(t),
  processor: t => /\b(processor|chip|snapdragon|mediatek|dimensity|exynos|bionic|intel|amd|i3|i5|i7|i9|ryzen|m1|m2|m3)\b/.test(t),
  owner: t => /\b(owner|first owner|1st owner|second owner|2nd owner|single owner|third owner)\b/.test(t),
  insurance: t => /\b(insurance|comprehensive|third party|valid till|valid upto|expired)\b/.test(t),
  material: t => /\b(material|wood|wooden|metal|steel|plastic|leather|fabric|glass|marble)\b/.test(t),
  dimensions: t => /\b(dimension|dimensions|length|width|height|inch|cm|ft|feet)\b/.test(t),
  age: t => /\b(age|year old|years old|month old|months old|used for|bought)\b/.test(t),
  salary: t => /\b(salary|ctc|lpa|per annum|per month|package|stipend)\b/.test(t),
  experience: t => /\b(experience|fresher|years|yrs|yr)\b/.test(t),
  availability: t => /\b(available|immediate|possession|move in|vacant|ready to move)\b/.test(t),
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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasLabelWithValue(text, fieldKey) {
  const template = FIELD_TEMPLATES[fieldKey];
  if (!template) return false;
  const label = template.trim().replace(/:$/, '');
  const re = new RegExp(`${escapeRegex(label)}\\s*:\\s*\\S`, 'i');
  return re.test(text);
}

function isFormFieldSatisfied(fieldKey, { price, location, adTitle }) {
  if (fieldKey === 'price') {
    const p = String(price || '').trim();
    return p.length > 0 && /\d/.test(p);
  }
  if (fieldKey === 'location') {
    return String(location || '').trim().length >= 2;
  }
  if (fieldKey === 'title') {
    return String(adTitle || '').trim().length >= 2;
  }
  return false;
}

function checkFieldPresent(text, field, formContext = {}) {
  if (isFormFieldSatisfied(field.key, formContext)) return true;
  const lower = (text || '').toLowerCase();
  if (hasLabelWithValue(lower, field.key)) return true;
  const checker = FIELD_CHECKERS[field.key];
  return checker ? checker(lower) : false;
}

function buildDetectionText({ title, price, location, value }) {
  return [title, price, location, value].filter(Boolean).join(' ');
}

// Accept category and subcategory as props
const AiTextArea = ({
  value,
  onChange,
  category,
  subcategory,
  onInsightsChange,
  title,
  price,
  location,
  onAiWrite,
  aiLoading = false,
  aiButtonLabel = 'AI Write',
}) => {
	const [touched, setTouched] = useState(false);
  const [showTypingTip, setShowTypingTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
	const requiredFields = getRequiredFieldDefs(category, subcategory);
  const detectionText = buildDetectionText({ title, price, location, value });
  const formContext = { price, location, adTitle: title };
	const completedFields = requiredFields.filter(f => checkFieldPresent(detectionText, f, formContext));
	const missingFields = requiredFields.filter(f => !checkFieldPresent(detectionText, f, formContext));
	const progress = Math.round((completedFields.length / requiredFields.length) * 100);
	const nextMissing = missingFields[0];

	const handleChange = e => {
		setTouched(true);
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
  }, [detectionText, touched, missingFields.length]);

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
  const allComplete = requiredFields.length > 0 && missingFields.length === 0;

  return (
    <div className="ai-insights">
      <div className="ai-insights-header">
        <span className="ai-insights-title">Detail checklist</span>
        <span className="ai-insights-count">
          {completedFields.length}/{requiredFields.length} added
        </span>
      </div>

      {showTypingTip && activeTipField && (
        <div className="ai-insights-suggestion">
          <div className="ai-insights-suggestion-head">
            <span className="ai-insights-suggestion-icon" aria-hidden>💡</span>
            <span className="ai-insights-suggestion-label">Suggestion</span>
          </div>
          <p className="ai-insights-suggestion-text">
            Add <strong>{activeTipField.label}</strong>{' '}
            {FIELD_EXAMPLES[activeTipField.key] || 'to improve listing quality'}.
          </p>
        </div>
      )}

      <div className="ai-insights-input-wrap">
        <textarea
          value={value}
          onChange={handleChange}
          rows={6}
          className={`ai-insights-input${missingFields.length && touched ? ' ai-insights-input--warn' : ''}`}
          placeholder={`Describe your ${subcategory || category || 'item'} in detail...`}
        />
        {onAiWrite && (
          <button
            type="button"
            className={`ai-insights-ai-btn${allComplete ? ' ai-insights-ai-btn--refine' : ''}`}
            onClick={onAiWrite}
            disabled={aiLoading}
          >
            {aiLoading ? (
              <span className="ai-insights-ai-btn-loading">...</span>
            ) : (
              <>
                <Sparkles size={14} strokeWidth={2.25} aria-hidden />
                <span>{aiButtonLabel}</span>
              </>
            )}
          </button>
        )}
      </div>

      {touched && missingFields.length > 0 && (
        <div className="ai-insights-hint">
          <span className="ai-insights-hint-icon" aria-hidden>💡</span>
          <span className="ai-insights-hint-text">
            Consider adding: {missingFields.map(f => f.label).join(', ')}
          </span>
        </div>
      )}

      {!touched && nextMissing && (
        <p className="ai-insights-start-tip">
          Tip: Start with <strong>{nextMissing.label}</strong> for better visibility.
        </p>
      )}

      <div className="ai-insights-chips">
        {requiredFields.map(f => {
          const done = checkFieldPresent(detectionText, f, formContext);
          return (
            <button
              type="button"
              key={f.key}
              className={`ai-insights-chip${done ? ' ai-insights-chip--done' : ''}`}
              style={done ? { backgroundColor: f.color, borderColor: f.color } : { borderColor: f.color }}
              onClick={() => addTemplate(f)}
            >
              {f.label}{done ? ' ✓' : ''}
            </button>
          );
        })}
      </div>

      <div className="ai-insights-progress-track">
        <div
          className={`ai-insights-progress-fill${progress === 100 ? ' ai-insights-progress-fill--complete' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="ai-insights-progress-label">
        {completedFields.length}/{requiredFields.length} fields mentioned
      </p>
    </div>
  );
};

export default AiTextArea;
