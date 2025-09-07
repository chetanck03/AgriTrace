import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCode, Search } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const ConsumerPage = () => {
  const [traceId, setTraceId] = useState('')
  const navigate = useNavigate()

  const handleTrace = (e) => {
    e.preventDefault()
    if (traceId.trim()) {
      navigate(`/trace/${traceId.trim()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-900">Trace Your Produce</h1>
            <p className="text-gray-600">
              Enter a Traceability ID or scan a QR code to view complete supply chain information
            </p>
          </Card.Header>
          
          <Card.Content>
            <div className="space-y-6">
              <form onSubmit={handleTrace} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Traceability ID
                  </label>
                  <input
                    type="text"
                    value={traceId}
                    onChange={(e) => setTraceId(e.target.value)}
                    placeholder="Enter Traceability ID (e.g., 1, 2, 3...)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg">
                  <Search className="h-4 w-4 mr-2" />
                  Trace Produce
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-50 text-gray-500">or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="lg">
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>

              <div className="bg-blue-50 p-4 rounded-md">
                <h3 className="font-semibold text-blue-900 mb-2">How to find your Traceability ID:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check the QR code on your product packaging</li>
                  <li>• Look for the ID number on your receipt</li>
                  <li>• Ask your retailer for the traceability information</li>
                </ul>
              </div>
            </div>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default ConsumerPage