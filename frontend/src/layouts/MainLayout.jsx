import React from 'react';

export default function MainLayout({ children, activeTab, setActiveTab, userRole, setUserRole, theme, toggleTheme, streamConnected }) {
  return (
    <div className="app-container">
      {children}
    </div>
  );
}
