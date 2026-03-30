import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { EntriesProvider } from './context/EntriesContext.jsx'
import NavBar from './components/NavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Log from './pages/Log.jsx'
import History from './pages/History.jsx'

export default function App() {
  return (
    <EntriesProvider>
      <BrowserRouter>
        <NavBar />
        <main className="max-w-5xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/log" element={<Log />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </BrowserRouter>
    </EntriesProvider>
  )
}
