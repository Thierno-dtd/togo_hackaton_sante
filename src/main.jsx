import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MediConnectApp from "./App.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MediConnectApp />
  </StrictMode>,
)
