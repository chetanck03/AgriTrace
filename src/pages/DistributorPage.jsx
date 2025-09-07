import React from 'react'
import { useWeb3 } from '../contexts/Web3Context'
import { UserRole } from '../lib/contract'
import Card from '../components/ui/Card'

const DistributorPage = () => {
  const { userRole } = useWeb3()

  if (userRole !== UserRole.DISTRIBUTOR) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <Card.Content className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">Only registered distributors can access this page.</p>
            </Card.Content>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
            <p className="text-gray-600">Manage logistics and supply chain operations</p>
          </Card.Header>
          
          <Card.Content>
            <div className="text-center py-8">
              <p className="text-gray-600">Distributor features coming soon...</p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default DistributorPage