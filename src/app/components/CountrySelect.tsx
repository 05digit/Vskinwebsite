import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

interface Country {
  code: string;
  name: string;
  flag: string;
}

// Only EU member states (27 countries) + EFTA/EEA countries (Norway, Switzerland, Iceland, Liechtenstein)
// and micro-states with special EU relationships
const EU_COUNTRIES: Country[] = [
  // Baltic States + Poland (priority for Lithuanian business)
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  // All other countries (alphabetically)
  { code: 'AD', name: 'Andorra', flag: '🇦🇩' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦' },
];

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function CountrySelect({ value, onChange, required }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedCountry = EU_COUNTRIES.find(c => c.name === value);

  // Filter countries based on search
  const filteredCountries = EU_COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle scroll to show/hide gradient indicator
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5; // 5px threshold
      setShowScrollIndicator(!isAtBottom);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Reset scroll indicator when opening
    if (isOpen) {
      setShowScrollIndicator(true);
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country.name);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border border-sand focus:border-brown focus:outline-none transition-colors bg-white text-left flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          {selectedCountry ? (
            <>
              <span className="text-xl">{selectedCountry.flag}</span>
              <span className="text-brown-dark">{selectedCountry.name}</span>
            </>
          ) : (
            <span className="text-brown">Select a country</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-brown transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-sand shadow-lg overflow-hidden flex flex-col" style={{ maxHeight: '280px' }}>
          {/* Search Input */}
          <div className="p-2 border-b border-sand">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brown" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search countries..."
                className="w-full pl-10 pr-4 py-2 border border-sand focus:border-brown focus:outline-none text-sm"
              />
            </div>
          </div>

          {/* Country List with scroll indicator */}
          <div className="relative" style={{ height: '220px' }}>
            <div className="overflow-y-auto h-full" ref={scrollContainerRef} onScroll={handleScroll}>
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => handleSelect(country)}
                    className={`w-full px-4 py-3 text-left hover:bg-cream transition-colors flex items-center gap-3 ${
                      value === country.name ? 'bg-cream border-l-2 border-brown' : ''
                    }`}
                  >
                    <span className="text-xl">{country.flag}</span>
                    <span className="text-brown-dark">{country.name}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center text-brown">
                  No countries found
                </div>
              )}
            </div>
            {/* Subtle gradient fade to indicate scrollable content */}
            {filteredCountries.length > 4 && (
              <div 
                className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none transition-opacity duration-300" 
                style={{
                  background: 'linear-gradient(to top, #FAF8F5 0%, rgba(250, 248, 245, 0.6) 50%, transparent 100%)',
                  opacity: showScrollIndicator ? 1 : 0
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Hidden input for form validation */}
      <input
        type="hidden"
        name="country"
        value={value}
        required={required}
      />
    </div>
  );
}