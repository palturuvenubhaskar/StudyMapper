import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './PremiumSelect.css';

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

  const handleSelect = (option) => {
    onChange({ target: { value: option } });
    setIsOpen(false);
  };

  return (
    <div className={`premium-custom-select ${className}`} ref={dropdownRef}>
      <div 
        className={`premium-select-trigger ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value}</span>
        <ChevronDown size={16} className={`chevron ${isOpen ? 'open' : ''}`} />
      </div>
      
      {isOpen && (
        <div className={`premium-select-dropdown ${placement}`}>
          <div className="premium-select-options">
            {options.map((option) => (
              <div 
                key={option} 
                className={`premium-select-option ${value === option ? 'selected' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
                {value === option && <Check size={14} className="check-icon" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
