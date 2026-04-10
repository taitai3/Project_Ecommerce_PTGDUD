import React from 'react';
import StoreHeader from './StoreHeader';
import StoreFooter from './StoreFooter';
import ChatBot from './ChatBot';

const StoreLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StoreHeader />
      <main className="flex-1">
        {children}
      </main>
      <StoreFooter />
      <ChatBot />
    </div>
  );
};

export default StoreLayout;
