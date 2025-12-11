'use client';

import React, { useEffect, useState } from 'react';
import { X, Shield, AlertTriangle, Crown, CheckCircle } from 'lucide-react';

interface VerificationDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
  isDarkMode?: boolean;
}

export default function VerificationDetailsModal({
  isOpen,
  onClose,
  postId,
  isDarkMode = false
}: VerificationDetailsModalProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && postId) {
      fetchVerificationDetails();
    }
  }, [isOpen, postId]);

  const fetchVerificationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/verification`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching verification details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const species = data?.identification?.species;
  const safetyProtocol = data?.safety_protocols;
  const validation = data?.identification?.expert_validations?.[0];
  const expert = validation?.experts;
  const expertProfile = expert?.user_profiles;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4">
      <div 
        className={`rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden ${
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
            <CheckCircle className="w-6 h-6 text-green-600" />
            Expert Verification Details
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Loading verification details...
            </div>
          ) : !data?.is_verified ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              This post has not been verified by an expert yet.
            </div>
          ) : (
            <>
              {/* Expert Info */}
              {expertProfile && (
                <div className={`p-4 rounded-lg ${
                  isDarkMode ? 'bg-gray-800' : 'bg-green-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-300">
                      {expertProfile.profile_picture ? (
                        <img src={expertProfile.profile_picture} alt={expertProfile.username} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Crown className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          @{expertProfile.username}
                        </span>
                        <div title="Verified Expert">
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Verified {new Date(validation.validated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {validation.validation_notes && (
                    <p className={`mt-3 text-sm italic ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{validation.validation_notes}"
                    </p>
                  )}
                </div>
              )}

              {/* Species Information */}
              {species && (
                <div>
                  <h4 className={`text-lg font-bold mb-4 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Shield className="w-5 h-5 text-green-600" />
                    Species Information
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {species.image_url && (
                      <div className="md:col-span-2">
                        <img 
                          src={species.image_url} 
                          alt={species.common_name || species.scientific_name}
                          className="w-full max-h-64 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Scientific Name
                      </p>
                      <p className={`text-lg font-semibold italic ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {species.scientific_name || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Common Name
                      </p>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {species.common_name || 'N/A'}
                      </p>
                    </div>

                    <div>
                      <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Conservation Status
                      </p>
                      <p className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                        {species.conservation_status}
                      </p>
                    </div>

                    {species.habitat && (
                      <div className="md:col-span-2">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Habitat
                        </p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {species.habitat}
                        </p>
                      </div>
                    )}

                    {species.behavior && (
                      <div className="md:col-span-2">
                        <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Behavior
                        </p>
                        <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {species.behavior}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Safety Protocol */}
              {safetyProtocol && (
                <div className={`p-4 rounded-lg border-2 ${
                  safetyProtocol.safety_level === 'Highly Dangerous' 
                    ? 'border-red-500 bg-red-50/50' 
                    : safetyProtocol.safety_level === 'Dangerous'
                    ? 'border-orange-500 bg-orange-50/50'
                    : safetyProtocol.safety_level === 'Caution'
                    ? 'border-yellow-500 bg-yellow-50/50'
                    : 'border-green-500 bg-green-50/50'
                } ${isDarkMode && 'bg-opacity-20'}`}>
                  <h4 className={`text-lg font-bold mb-3 flex items-center gap-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      safetyProtocol.safety_level === 'Highly Dangerous' || safetyProtocol.safety_level === 'Dangerous'
                        ? 'text-red-600'
                        : safetyProtocol.safety_level === 'Caution'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`} />
                    Safety Protocol
                  </h4>

                  <div className="mb-3">
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Safety Level
                    </p>
                    <p className={`text-lg font-bold ${
                      safetyProtocol.safety_level === 'Highly Dangerous' || safetyProtocol.safety_level === 'Dangerous'
                        ? 'text-red-600'
                        : safetyProtocol.safety_level === 'Caution'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {safetyProtocol.safety_level}
                    </p>
                  </div>

                  {safetyProtocol.guidance && (
                    <div>
                      <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Safety Guidance
                      </p>
                      <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                        {safetyProtocol.guidance}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#899A3C] text-white rounded-lg font-medium hover:bg-[#6e7b2f] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
