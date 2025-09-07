import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Leaf, Menu, X } from 'lucide-react'
import { useWeb3 } from '../../contexts/Web3Context'
import { getUserRoleText } from '../../lib/contract'
import WalletConnect from '../ui/WalletConnect'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { isConnected, userRole } = useWeb3()

  const navigation = [
    { name: 'Home', path: '/', show: true },
    { name: 'Dashboard', path: '/dashboard', show: isConnected },
    { name: 'Farmer', path: '/farmer', show: isConnected && userRole === 1 },
    { name: 'Distributor', path: '/distributor', show: isConnected && userRole === 2 },
    { name: 'Retailer', path: '/retailer', show: isConnected && userRole === 3 },
    { name: 'Consumer', path: '/consumer', show: isConnected && userRole === 4 },
  ].filter(item => item.show)

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">AgriTrace</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Wallet Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isConnected && userRole !== null && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {getUserRoleText(userRole)}
              </div>
            )}
            <WalletConnect />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-gray-200 pt-4 pb-3">
              {isConnected && userRole !== null && (
                <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full mx-3 mb-3 inline-block">
                  {getUserRoleText(userRole)}
                </div>
              )}
              <div className="px-3">
                <WalletConnect />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header