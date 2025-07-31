import React from 'react';
import { useAuth } from './AuthContext';
import { EmergencyProvider } from './EmergencyContext';

export const EmergencyProviderWithAuth = ({ children }) => {
  const { authToken } = useAuth();

  return (
    <EmergencyProvider authToken={authToken}>
      {children}
    </EmergencyProvider>
  );
};
