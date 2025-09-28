import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from 'react-router-dom'
import { UserProvider } from './context/user-context.jsx'
import { ThemeProvider } from './context/theme-context.jsx'
import { SearchProvider } from './context/search-context.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <UserProvider>
        <SearchProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </SearchProvider>
      </UserProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
