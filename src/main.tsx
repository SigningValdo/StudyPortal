import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initKeycloak } from '@services/keycloak.service';

const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === 'true';

const bootstrap = async () => {
  if (!FORCE_MOCK) {
    await initKeycloak();
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
};

bootstrap();
