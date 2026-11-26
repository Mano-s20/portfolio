import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import App from './App'
import { EnvironmentProvider } from './context/EnvironmentContext'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

const root = document.getElementById('root')
if (!root) throw new Error('Root element not found')

createRoot(root).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <EnvironmentProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </EnvironmentProvider>
    </MotionConfig>
  </StrictMode>,
)
