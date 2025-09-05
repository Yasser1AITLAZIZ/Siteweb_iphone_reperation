import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ChatbotWidget from './components/ChatbotWidget'
import CartWidget from './components/CartWidget'
import ScrollToTop from './components/ScrollToTop'

// Import des pages
import Index from './pages/Index'
import Reparations from './pages/Reparations'
import Boutique from './pages/Boutique'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import Admin from './pages/Admin'
import UserJourneyTest from './tests/UserJourneyTest'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/reparations" element={<Reparations />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
                                   <Route path="/profile" element={<Profile />} />
                     <Route path="/orders" element={<Orders />} />
                     <Route path="/admin" element={<Admin />} />
                     <Route path="/test" element={<UserJourneyTest />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Global Widgets */}
          <ChatbotWidget />
          <CartWidget />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
