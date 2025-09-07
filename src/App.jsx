import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { config, queryClient } from './lib/config'
import { Web3Provider } from './contexts/Web3Context'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import TracePage from './pages/TracePage'
import FarmerPage from './pages/FarmerPage'
import DistributorPage from './pages/DistributorPage'
import RetailerPage from './pages/RetailerPage'
import ConsumerPage from './pages/ConsumerPage'

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/trace/:id" element={<TracePage />} />
                  <Route path="/farmer" element={<FarmerPage />} />
                  <Route path="/distributor" element={<DistributorPage />} />
                  <Route path="/retailer" element={<RetailerPage />} />
                  <Route path="/consumer" element={<ConsumerPage />} />
                </Routes>
              </Layout>
              <Toaster 
                position="bottom-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
              {/* <WalletDebug /> */}
            </div>
          </Router>
        </Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
