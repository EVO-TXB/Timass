import React from 'react';
import timassLogo from '../assets/timass-logo.png';
import heroLeftFull from '../assets/hero-left-full.png';

/**
 * Shared layout for Authentication pages (Login & Register)
 * Accurately replicates the split 2-column aesthetic from design files:
 * - Left column: Full fidelity artwork matching design sample (headline + 3D illustration).
 * - Right column: Clean white background, centered Timass logo, card container, and footer.
 */
export default function AuthLayout({ children, footerText, footerLinkText, footerLinkTo }) {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white selection:bg-[#4338ca]/15 selection:text-[#4338ca]">
      {/* LEFT COLUMN: HERO & BRANDING */}
      <div className="relative w-full lg:w-1/2 bg-[#fbe7e9] flex items-center justify-center p-0 overflow-hidden min-h-[380px] lg:min-h-screen">
        <img
          src={heroLeftFull}
          alt="Làm chủ thời gian, tối ưu hiệu suất cùng Timass"
          className="w-full h-full object-cover object-center max-h-screen select-none pointer-events-none"
        />
      </div>

      {/* RIGHT COLUMN: AUTHENTICATION FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 py-10 sm:px-8 lg:px-12 bg-white min-h-[600px]">
        {/* Top Brand Logo */}
        <div className="mb-6 lg:mb-8 flex justify-center">
          <img
            src={timassLogo}
            alt="Timass Logo"
            className="h-10 sm:h-12 w-auto object-contain select-none"
          />
        </div>

        {/* Auth Form Card */}
        <div className="w-full max-w-[460px] bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-[0_12px_40px_-8px_rgba(30,27,75,0.08)] p-6 sm:p-9 transition-all">
          {children}
        </div>

        {/* Bottom Link */}
        {footerText && footerLinkText && footerLinkTo && (
          <div className="mt-6 text-center text-sm text-gray-600">
            {footerText}{' '}
            <a
              href={footerLinkTo}
              className="font-medium text-[#3b43c6] hover:text-[#2f36a8] hover:underline transition-colors"
            >
              {footerLinkText}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
