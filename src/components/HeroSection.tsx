import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-red-600 to-red-800 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-2/3 mb-4 md:mb-0">
            <h2 className="text-2xl font-bold mb-2">Live Q&A Session</h2>
            <p className="text-sm opacity-90">
              Scan the QR code to access this session on your mobile device
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center">
            <div className="bg-white p-2 rounded-lg shadow-lg">
              <QRCodeSVG 
                value={window.location.href}
                size={120}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;