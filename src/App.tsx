import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ScoreProvider } from './context/ScoreContext'
import { WidgetPage } from './pages/WidgetPage'
import { AdminPage } from './pages/AdminPage'
import './App.css'

function AppNav() {
  const { pathname } = useLocation()
  const isWidget = pathname === '/' || pathname === '/widget'
  if (isWidget) return null
  return (
    <nav className="app-nav">
      <Link to="/widget">Виджет</Link>
      <Link to="/admin">Управление</Link>
    </nav>
  )
}

function App() {
  return (
    <ScoreProvider>
      <BrowserRouter>
        <AppNav />
        <Routes>
          <Route path="/widget" element={<WidgetPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/" element={<WidgetPage />} />
        </Routes>
      </BrowserRouter>
    </ScoreProvider>
  )
}

export default App
