import React from 'react';
import { IonSpinner } from '@ionic/react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Carregando...' }) => {
  return (
    <div className="loading-spinner-container">
      <IonSpinner name="crescent" />
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};
