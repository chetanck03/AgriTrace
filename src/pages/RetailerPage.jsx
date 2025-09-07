import React from 'react'
import Card from '../components/ui/Card'

const RetailerPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-900">Retailer Dashboard</h1>
            <p className="text-gray-600">Manage retail operations and customer sales</p>
          </Card.Header>
          
          <Card.Content>
            <div className="text-center py-8">
              <p className="text-gray-600">Retailer features coming soon...</p>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default RetailerPage