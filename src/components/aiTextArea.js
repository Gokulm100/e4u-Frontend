import React, { useState } from 'react';


// Field definitions for each category/subcategory
const FIELD_MAP = {
	Electronics: {
		Mobiles: [
			{ key: 'brand', label: 'Brand', color: '#2563eb' },
			{ key: 'model', label: 'Model', color: '#059669' },
			{ key: 'storage', label: 'Storage', color: '#64748b' },
			{ key: 'condition', label: 'Condition', color: '#a21caf' },
			{ key: 'warranty', label: 'Warranty', color: '#0ea5e9' },
			{ key: 'accessories', label: 'Accessories', color: '#f59e42' },
            { key: 'color', label: 'Color', color: '#f43f5e'}
		],
		Tv: [
			{ key: 'brand', label: 'Brand', color: '#2563eb' },
			{ key: 'size', label: 'Size (inches)', color: '#059669' },
			{ key: 'type', label: 'Type (LED/LCD/OLED)', color: '#64748b' },
			{ key: 'condition', label: 'Condition', color: '#a21caf' },
			{ key: 'warranty', label: 'Warranty', color: '#0ea5e9' },
			{ key: 'accessories', label: 'Accessories', color: '#f59e42' }
		],
		'Washing Machine': [
			{ key: 'brand', label: 'Brand', color: '#2563eb' },
			{ key: 'type', label: 'Type (Front/Top Load)', color: '#059669' },
			{ key: 'capacity', label: 'Capacity (kg)', color: '#64748b' },
			{ key: 'condition', label: 'Condition', color: '#a21caf' },
			{ key: 'warranty', label: 'Warranty', color: '#0ea5e9' },
			{ key: 'accessories', label: 'Accessories', color: '#f59e42' }
		]
	},
	'Real Estate': {
		'House For Rent': [
			{ key: 'location', label: 'Location', color: '#2563eb' },
			{ key: 'bedrooms', label: 'Bedrooms', color: '#059669' },
			{ key: 'bathrooms', label: 'Bathrooms', color: '#64748b' },
			{ key: 'area', label: 'Area (sqft)', color: '#a21caf' },
			{ key: 'furnishing', label: 'Furnishing', color: '#0ea5e9' },
			{ key: 'rent', label: 'Rent', color: '#f59e42' }
		],
		'House For Sale': [
			{ key: 'location', label: 'Location', color: '#2563eb' },
			{ key: 'bedrooms', label: 'Bedrooms', color: '#059669' },
			{ key: 'bathrooms', label: 'Bathrooms', color: '#64748b' },
			{ key: 'area', label: 'Area (sqft)', color: '#a21caf' },
			{ key: 'furnishing', label: 'Furnishing', color: '#0ea5e9' },
			{ key: 'price', label: 'Price', color: '#f59e42' }
		],
		'Plot For Rent': [
			{ key: 'location', label: 'Location', color: '#2563eb' },
			{ key: 'area', label: 'Area (sqft)', color: '#059669' },
			{ key: 'rent', label: 'Rent', color: '#64748b' }
		],
		'Plot For Sale': [
			{ key: 'location', label: 'Location', color: '#2563eb' },
			{ key: 'area', label: 'Area (sqft)', color: '#059669' },
			{ key: 'price', label: 'Price', color: '#64748b' }
		]
	},
	Vehicles: {
		Cars: [
			{ key: 'brand', label: 'Brand', color: '#2563eb' },
			{ key: 'model', label: 'Model', color: '#059669' },
			{ key: 'year', label: 'Year', color: '#64748b' },
			{ key: 'mileage', label: 'Mileage', color: '#a21caf' },
			{ key: 'fuel', label: 'Fuel Type', color: '#0ea5e9' },
			{ key: 'transmission', label: 'Transmission', color: '#f59e42' }
		],
		Bikes: [
			{ key: 'brand', label: 'Brand', color: '#2563eb' },
			{ key: 'model', label: 'Model', color: '#059669' },
			{ key: 'year', label: 'Year', color: '#64748b' },
			{ key: 'mileage', label: 'Mileage', color: '#a21caf' },
			{ key: 'fuel', label: 'Fuel Type', color: '#0ea5e9' }
		],
		'Other Vechicles': [
			{ key: 'type', label: 'Type', color: '#2563eb' },
			{ key: 'brand', label: 'Brand', color: '#059669' },
			{ key: 'year', label: 'Year', color: '#64748b' }
		]
	},
	Games: {
		'Playstation Games': [
			{ key: 'title', label: 'Title', color: '#2563eb' },
			{ key: 'platform', label: 'Platform', color: '#059669' },
			{ key: 'condition', label: 'Condition', color: '#a21caf' }
		],
		Controlers: [
			{ key: 'type', label: 'Type', color: '#2563eb' },
			{ key: 'brand', label: 'Brand', color: '#059669' },
			{ key: 'condition', label: 'Condition', color: '#a21caf' }
		],
		'Gaming Rig': [
			{ key: 'cpu', label: 'CPU', color: '#2563eb' },
			{ key: 'gpu', label: 'GPU', color: '#059669' },
			{ key: 'ram', label: 'RAM', color: '#64748b' },
			{ key: 'storage', label: 'Storage', color: '#a21caf' },
			{ key: 'condition', label: 'Condition', color: '#0ea5e9' }
		]
	}
};


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
  color: text => /color|red|blue|green|black|white|yellow|pink|purple|orange/.test(text)
};

function checkFieldPresent(text, field) {
  const lower = (text || '').toLowerCase();
  const checker = FIELD_CHECKERS[field.key];
  return checker ? checker(lower) : false;
}


// Accept category and subcategory as props
const AiTextArea = ({ value, onChange, category, subcategory }) => {
	const [touched, setTouched] = useState(false);
	// Fallback to Mobiles if not provided
	const requiredFields =
		(FIELD_MAP[category]?.[subcategory]) || FIELD_MAP['Electronics']['Mobiles'];
	const completedFields = requiredFields.filter(f => checkFieldPresent(value || '', f));
	const missingFields = requiredFields.filter(f => !checkFieldPresent(value || '', f));
	const progress = Math.round((completedFields.length / requiredFields.length) * 100);

	const handleChange = e => {
		setTouched(true);
		onChange && onChange(e);
	};

		return (
			<div style={{  maxWidth: 520, background: '#fff', borderRadius: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)', padding: 18, border: '1px solid #f1f5f9' }}>
				<div style={{ marginBottom: 10 }}>
					<div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4, color: '#22223b' }}>Ad Description <span style={{ color: '#e11d48' }}>*</span></div>
					
				</div>
				   <textarea
					   value={value}
					   onChange={handleChange}
					   rows={6}
					   style={{
						   width: '-webkit-fill-available',
						   fontSize: 15,
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
					   placeholder={`Describe your ${subcategory || category || 'item'} in detail... (${requiredFields.map(f => f.label).join(', ')})`}
				   />
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
	
				</div>
<div style={{ display: 'flex', flexWrap: 'wrap',paddingTop: 6,paddingBottom: 6, gap: 6, marginBottom: 6 }}>
						{requiredFields.map(f => (
							<span key={f.key} style={{
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
								transition: 'all 0.2s'
							}}>
								{f.label}
								{checkFieldPresent(value || '', f) ? <span style={{ marginLeft: 4, fontSize: 13 }}>✓</span> : null}
							</span>
						))}
					</div>
                    					<div style={{ height: 5, background: '#f3f4f6', borderRadius: 3, marginBottom: 10, overflow: 'hidden' }}>
						<div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#22c55e' : '#2563eb', transition: 'width 0.3s' }} />
					</div>
			</div>
            
		);
};

export default AiTextArea;
