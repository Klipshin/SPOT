'use client';

import React, { useState } from 'react';
import { X, Shield, AlertTriangle } from 'lucide-react';

interface VerifySpeciesModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  postTitle: string;
  postImage?: string | null;
  isDarkMode?: boolean;
  onVerified: () => void;
}

export default function VerifySpeciesModal({
  isOpen,
  onClose,
  postId,
  postTitle,
  postImage,
  isDarkMode = false,
  onVerified
}: VerifySpeciesModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    scientific_name: '',
    common_name: '',
    habitat: '',
    conservation_status: 'Least Concern',
    behavior: '',
    image_url: '',
    guidance: '',
    safety_level: 'Safe',
    validation_notes: ''
  });

  const conservationStatuses = [
    'Least Concern',
    'Near Threatened',
    'Vulnerable',
    'Endangered',
    'Critically Endangered',
    'Extinct in the Wild',
    'Extinct'
  ];

  const safetyLevels = [
    'Safe',
    'Caution',
    'Dangerous',
    'Highly Dangerous'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/posts/${postId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to verify species';
        console.error('Verification error:', data);
        alert(errorMessage);
        return;
      }

      alert('Species verified successfully!');
      onVerified();
      onClose();
    } catch (error) {
      console.error('Error verifying species:', error);
      alert('Failed to verify species. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div 
        className={`rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden ${
          isDarkMode ? 'bg-gray-900' : 'bg-white'
        }`}
        style={{ border: '2px solid #899A3C' }}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-xl font-bold flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            <Shield className="w-6 h-6 text-green-600" />
            Verify Species Identification
          </h3>
          <button 
            onClick={onClose}
            className={`transition-colors p-1 ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Post Preview */}
        <div className={`px-6 py-4 border-b ${
          isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
        }`}>
          <p className={`text-sm font-semibold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Verifying Post:
          </p>
          <div className="flex items-center gap-4">
            {postImage && (
              <img 
                src={postImage} 
                alt="Post" 
                className="w-20 h-20 object-cover rounded-lg"
              />
            )}
            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {postTitle}
            </h4>
          </div>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Species Information Section */}
            <div>
              <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="text-green-600">📋</span> Species Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Scientific Name *
                  </label>
                  <input
                    type="text"
                    name="scientific_name"
                    value={formData.scientific_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Python reticulatus"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Common Name *
                  </label>
                  <input
                    type="text"
                    name="common_name"
                    value={formData.common_name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Reticulated Python"
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Conservation Status *
                  </label>
                  <select
                    name="conservation_status"
                    value={formData.conservation_status}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {conservationStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://..."
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Habitat
                  </label>
                  <textarea
                    name="habitat"
                    value={formData.habitat}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe the typical habitat..."
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Behavior
                  </label>
                  <textarea
                    name="behavior"
                    value={formData.behavior}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Describe typical behavior patterns..."
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Safety Protocol Section */}
            <div>
              <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                Safety Protocol
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Safety Level *
                  </label>
                  <select
                    name="safety_level"
                    value={formData.safety_level}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    {safetyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Safety Guidance
                  </label>
                  <textarea
                    name="guidance"
                    value={formData.guidance}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Provide safety guidelines and precautions..."
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Validation Notes (Optional)
                  </label>
                  <textarea
                    name="validation_notes"
                    value={formData.validation_notes}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="Additional notes for this verification..."
                    className={`w-full px-4 py-2 border rounded-lg ${
                      isDarkMode 
                        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-700 text-white hover:bg-gray-600' 
                    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Verifying...' : 'Verify Species'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
