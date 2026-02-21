import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { ScoreProvider } from './context/ScoreContext'
import { TimerProvider } from './context/TimerContext'
import { WidgetPage } from './pages/WidgetPage'
import { TimerWidgetPage } from './pages/TimerWidgetPage'
import { AdminPage } from './pages/AdminPage'
import './App.css'

function AppNav() {
  const { pathname } = useLocation()
  const isWidget = pathname === '/' || pathname === '/widget' || pathname === '/widget/timer'
  if (isWidget) return null
  return (
    <nav className="app-nav">
      <Link to="/widget">Счёт</Link>
      <Link to="/widget/timer">Таймер</Link>
      <Link to="/admin">Управление</Link>
    </nav>
  )
}

function App() {
  return (
    <ScoreProvider>
      <TimerProvider>
        <BrowserRouter>
          <AppNav />
          <Routes>
            <Route path="/widget" element={<WidgetPage />} />
            <Route path="/widget/timer" element={<TimerWidgetPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/" element={<WidgetPage />} />
          </Routes>
        </BrowserRouter>
      </TimerProvider>
    </ScoreProvider>
  )
}

export default App
