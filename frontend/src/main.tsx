import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get root element with proper null checking
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    "Root element with ID 'root' not found. Check your index.html file."
  );
}

// Create root and render app
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
