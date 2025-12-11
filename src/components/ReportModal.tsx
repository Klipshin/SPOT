"use client";

import { useState } from 'react';
import { X, Flag } from 'lucide-react';
import { contentViolations } from '@/src/lib/data/contentViolations';
import { createClient } from '@/src/utils/supabase/client';
import { useSupabase } from '@/src/components/providers/SupabaseProvider';

type ReportModalProps = {
  isOpen: boolean;
  onClose: () => void;
  contentType: 'post' | 'comment';
  contentId: string;
  reportedUserId: string;
  isDarkMode?: boolean;
};

export default function ReportModal({
  isOpen,
  onClose,
  contentType,
  contentId,
  reportedUserId,
  isDarkMode = false,
}: ReportModalProps) {
  const [selectedViolation, setSelectedViolation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { supabase, session } = useSupabase();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedViolation || !supabase || !session?.user?.id) {
      console.error('Missing required fields:', { selectedViolation, supabase: !!supabase, session: !!session?.user?.id });
      return;
    }

    if (!contentId || !reportedUserId) {
      console.error('Missing content or user ID:', { contentId, reportedUserId });
      alert('Missing required information. Please try again.');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting report:', {
        reporter_user_id: session.user.id,
        reported_user_id: reportedUserId,
        content_id: contentId,
        type: contentType,
        violation: selectedViolation,
      });

      // Use API route to bypass RLS
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reporter_user_id: session.user.id,
          reported_user_id: reportedUserId,
          content_id: contentId,
          type: contentType,
          violation: selectedViolation,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMessage = result.error || 'Failed to submit report';
        console.error('Error submitting report:', errorMessage);
        console.error('Error details:', result.details || result);
        alert(`Failed to submit report: ${errorMessage}`);
        return;
      }

      // Success case
      if (result.report) {
        console.log('Report submitted successfully:', result.report);
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setSelectedViolation(null);
          onClose();
        }, 1500);
      } else {
        console.error('Unexpected response format:', result);
        alert('Failed to submit report: Unexpected response format');
      }
    } catch (error: any) {
      console.error('Error submitting report:', error);
      alert(`Failed to submit report: ${error?.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSelectedViolation(null);
      setSubmitSuccess(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]" onClick={handleClose}>
      <div
        className={`rounded-xl shadow-2xl w-[500px] max-w-[90vw] overflow-hidden ${
          isDarkMode ? 'bg-[#2a2a2a]' : 'bg-white'
        }`}
        style={{ border: '2px solid #899A3C' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`px-6 py-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-gray-600' : 'border-gray-200'
        }`}>
          <div className="flex items-center gap-2">
            <Flag className={`w-5 h-5 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Report {contentType === 'post' ? 'Post' : 'Comment'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className={`transition-colors p-1 ${
              isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'
            } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitSuccess ? (
            <div className="text-center py-8">
              <div className={`text-lg font-semibold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                Report submitted successfully!
              </div>
              <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Thank you for helping keep our community safe.
              </p>
            </div>
          ) : (
            <>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Please select the reason for reporting this {contentType}:
              </p>

              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {contentViolations.map((violation) => (
                  <button
                    key={violation.id}
                    onClick={() => setSelectedViolation(violation.id)}
                    disabled={isSubmitting}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedViolation === violation.id
                        ? isDarkMode
                          ? 'border-[#899A3C] bg-[#899A3C]/20'
                          : 'border-[#899A3C] bg-[#DBE9AF]/30'
                        : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500 bg-[#3a3a3a]'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className={`font-semibold text-sm ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {violation.label}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {violation.description}
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedViolation || isSubmitting}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    selectedViolation && !isSubmitting
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

