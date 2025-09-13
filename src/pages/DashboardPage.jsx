import React from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { getUserRoleText, UserRole } from '../lib/contract'
import { Link } from 'react-router-dom'
import { Package, Plus, Search, Users, BarChart3, Truck } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import WalletConnect from '../components/ui/WalletConnect'
import UserRegistration from '../components/ui/UserRegistration'

const DashboardPage = () => {
  const { isConnected, userRole, myProduceItems, address } = useWeb3()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full">
          <Card.Content className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Please connect your wallet to access the dashboard</p>
            <WalletConnect />
          </Card.Content>
        </Card>
      </div>
    )
  }

  const getRoleDashboard = () => {
    switch (userRole) {
      case UserRole.FARMER:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">Register New Produce</h3>
              </Card.Header>
              <Card.Content>
                <p className="text-gray-600 mb-4">Add your harvested produce to the blockchain</p>
                <Link to="/farmer">
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Produce
                  </Button>
                </Link>
              </Card.Content>
            </Card>
            
            <Card>
              <Card.Header>
                <h3 className="text-lg font-semibold">My Produce</h3>
              </Card.Header>
              <Card.Content>
                <div className="text-3xl font-bold text-green-600 mb-2">{myProduceItems.length}</div>
                <p className="text-gray-600">Items registered</p>
              </Card.Content>
            </Card>
          </div>
        )
      
      case UserRole.DISTRIBUTOR:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/distributor">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <Card.Content className="text-center py-8">
                  <Truck className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold">Manage Logistics</h3>
                </Card.Content>
              </Card>
            </Link>
          </div>
        )
      
      default:
        return <UserRegistration />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {getUserRoleText(userRole)} • {address?.slice(0, 6)}...{address?.slice(-4)}
          </p>
        </div>
        
        {getRoleDashboard()}
      </div>
    </div>
  )
}

export default DashboardPage