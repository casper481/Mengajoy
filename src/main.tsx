import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/scheherazade-new/400.css'
import '@fontsource/scheherazade-new/700.css'
import '@fontsource/baloo-2/500.css'
import '@fontsource/baloo-2/700.css'
import '@fontsource/baloo-2/800.css'
import './index.css'
import App from './App'
import { ProgresProvider } from './lib/progres'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgresProvider>
      <App />
    </ProgresProvider>
  </StrictMode>,
)
