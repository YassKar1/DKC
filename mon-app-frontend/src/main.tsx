import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './output.css';
import  './config/constants.ts'
import App from './App.tsx'
import './index.css'
// import './test-auth.ts' a re tester
//vimport './test-api.ts' a re tester


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
