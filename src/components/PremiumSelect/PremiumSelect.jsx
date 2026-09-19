import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './PremiumSelect.css';

/**
 * PremiumSelect supports two option formats:
 * 1. Flat strings: ['Option A', 'Option B']
 * 2. Objects: [{ label: 'Category', value: '', isGroupHeader: true }, { label: 'Option', value: 'opt' }]
 */
export default function PremiumSelect({ value, onChange, options, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine placement when opening
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      // If less than 250px below and more space above, open upwards
      if (spaceBelow < 250 && rect.top > 250) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    }
  }, [isOpen]);

  const handleSelect = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  // Normalize options: support both ['string'] and [{ label, value, isGroupHeader }]
  const normalizedOptions = options.map((opt, idx) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt, isGroupHeader: false, key: opt };
    }
    return { ...opt, key: opt.value || `group-${idx}` };
  });

  // Display label for selected value
  const displayLabel = normalizedOptions.find(o => o.value === value)?.label || value;

  return (
    <div className={`premium-custom-select ${className}`} ref={dropdownRef}>
      <div 
        className={`premium-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className={`premium-select-dropdown ${placement}`}>
          <div className="premium-select-options">
            {normalizedOptions.map((opt) => {
              if (opt.isGroupHeader) {
                return (
                  <div key={opt.key} className="premium-select-group-header">
                    {opt.label}
                  </div>
                );
              }
              return (
                <div 
                  key={opt.key} 
                  className={`premium-select-option ${value === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                  {value === opt.value && <Check size={14} className="check-icon" />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
