import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ProgressProvider } from './state/progress.jsx';
import { ProgressJavaProvider } from './state/progressJava.jsx';
import { AkunProvider } from './state/akun.jsx';
import App from './App.jsx';
import './styles.css';
import { mulaiDengarInstall } from './state/install.js';

mulaiDengarInstall();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ProgressProvider>
        <ProgressJavaProvider>
          <AkunProvider>
            <App />
          </AkunProvider>
        </ProgressJavaProvider>
      </ProgressProvider>
    </BrowserRouter>
  </StrictMode>,
);
