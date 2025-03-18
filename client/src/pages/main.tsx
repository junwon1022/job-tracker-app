import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Global style
import '../styles/index.css'

//The main app component
import App from './App'


// Mount the React app inside the root div in index.html
createRoot(document.getElementById('root')!).render(
    <App />
)
