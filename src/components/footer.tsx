import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#630000] text-white py-6 text-center fixed left-0 bottom-0 w-full shadow-lg">
      <div className="container mx-auto px-4">
        <p className="text-sm md:text-base">
          © 2024 Created by: <span className="font-semibold">StandBy</span>. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
