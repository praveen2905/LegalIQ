import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * BackButton — subtle back-navigation control for secondary pages.
 *
 * Behaviour:
 *   - Calls navigate(-1) so the browser history stack is respected.
 *   - If there is no previous in-app history entry (delta === 0, i.e. the user
 *     landed directly on this URL), it falls back to the landing page "/".
 *
 * Props:
 *   fallback  {string}   Fallback path when history is empty. Default: "/"
 *   className {string}   Optional extra Tailwind classes.
 */
export default function BackButton({ fallback = '/', className = '' }) {
  const navigate = useNavigate();

  const handleBack = () => {
    // window.history.length <= 2 means there's no meaningful previous page
    // (the browser starts at 1 and the current page adds 1 more).
    if (window.history.length <= 2) {
      navigate(fallback, { replace: true });
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label="Go back"
      className={`inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${className}`}
    >
      <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
      Back
    </button>
  );
}
