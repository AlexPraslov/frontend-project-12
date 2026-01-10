import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider, ErrorBoundary } from '@rollbar/react'
import './index.css'
import App from './App.jsx'

const rollbarConfig = {
  accessToken: '95d5adeae90244cfafec2b50026cb556',
  environment: 'testenv',
};

function TestError() {
  const a = null;
  return a.hello();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <App />
        <TestError />
      </ErrorBoundary>
    </Provider>
  </StrictMode>,
)