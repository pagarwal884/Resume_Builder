import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <userProvider>
      <Routes>
        <Route path='/' element={<LandingPage />} />
      </Routes>
    </userProvider>
  )
}

export default App
