import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';
import App from './App';

AOS.init({ duration: 500, once: true, offset: 60, easing: 'ease-out-quad' });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
