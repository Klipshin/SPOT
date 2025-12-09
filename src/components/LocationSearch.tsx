"use client";

import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L, { LatLngExpression, LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

interface LocationSuggestion {
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationSearchProps {
  value: string;
  onChange: (location: string, lat?: number, lng?: number) => void;
}

// Helper component for the Geocoder
function LeafletGeocoder({ onLocationSelect }: { onLocationSelect: (address: string, lat: number, lng: number) => void }) {
  const map = useMapEvents({});

  useEffect(() => {
    // @ts-ignore
    const geocoder = L.Control.Geocoder.nominatim();
    
    // @ts-ignore
    const geocoderControl = L.Control.geocoder({
      query: "",
      placeholder: "Search location...",
      defaultMarkGeocode: false,
      geocoder
    })
    .on("markgeocode", function (e: any) {
      const latlng = e.geocode.center;
      map.setView(latlng, 13);
      onLocationSelect(e.geocode.name, latlng.lat, latlng.lng);
    })
    .addTo(map);

    return () => {
      geocoderControl.remove();
    };
  }, [map, onLocationSelect]);

  return null;
}

// Helper to handle clicks on the map
function MapClickHandler({ onLocationFound }: { onLocationFound: (addr: string, lat: number, lng: number) => void }) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      const { lat, lng } = e.latlng;
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
        .then((res) => res.json())
        .then((data) => {
          onLocationFound(data.display_name, lat, lng);
        });
    },
  });
  return null;
}

// Map Modal Component
function MapModal({ onClose, onSelectLocation }: { onClose: () => void; onSelectLocation: (location: string) => void }) {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const handleUpdate = (address: string, lat: number, lng: number) => {
    setSelectedAddress(address);
    setPosition([lat, lng] as LatLngExpression);
  };

  const handleConfirm = () => {
    if (selectedAddress) {
      onSelectLocation(selectedAddress);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-[#F1EEE5]">
          <h2 className="text-xl font-poppins-semibold text-[#2E0506ED]">Select Location</h2>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-600 transition-colors"
          >
            ×
          </button>
        </div>

        {/* Map Container */}
        <div className="h-[400px] w-full">
          <MapContainer 
            center={[10.3157, 123.8854] as LatLngExpression}
            zoom={12} 
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LeafletGeocoder onLocationSelect={handleUpdate} />
            <MapClickHandler onLocationFound={handleUpdate} />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-[#F1EEE5]">
          {selectedAddress && (
            <div className="mb-3 p-2 bg-white rounded-lg border border-gray-300">
              <p className="text-sm text-gray-600">Selected:</p>
              <p className="text-base font-poppins-semibold">{selectedAddress}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors font-poppins-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAddress}
              className="flex-1 py-2 px-4 rounded-lg bg-[#899A3C] text-white hover:bg-[#6d7a30] transition-colors font-poppins-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LocationSearch({ value, onChange }: LocationSearchProps) {
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Debounce the search
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchLocation(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    onChange(suggestion.display_name, parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleMapSelect = (location: string, lat?: number, lng?: number) => {
    onChange(location, lat, lng);
    setShowMap(false);
  };

  return (
    <>
      <div ref={wrapperRef} className="relative w-full">
        <div className="relative w-full flex items-center">
          <img
            src="/location-input.png"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6"
            alt="Location icon"
          />
          <input
            value={value}
            onChange={handleInputChange}
            placeholder="Search for a location"
            className="w-full pl-12 pr-12 p-2 border border-gray-500 rounded-xl text-xl bg-white"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowMap(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform bg-[#899A3C] text-white rounded-full p-1.5"
            title="Open map"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loading && (
              <div className="p-3 text-gray-500 text-center">Searching...</div>
            )}
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left p-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 transition-colors"
              >
                <div className="text-sm">{suggestion.display_name}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map Modal */}
      {showMap && (
        <MapModal
          onClose={() => setShowMap(false)}
          onSelectLocation={handleMapSelect}
        />
      )}
    </>
  );
}
