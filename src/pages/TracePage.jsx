import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useReadContract } from 'wagmi'
import { contractABI, contractAddress, getStatusText } from '../lib/contract'
import Card from '../components/ui/Card'
import { Package, MapPin, Calendar, User, DollarSign, Image } from 'lucide-react'
import { format } from 'date-fns'

const TracePage = () => {
  const { id } = useParams()
  const [searchId, setSearchId] = useState(id || '')

  const { data: produceData, isLoading, error } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'traceProduce',
    args: searchId ? [BigInt(searchId)] : undefined,
    enabled: !!searchId
  })

  const handleSearch = (e) => {
    e.preventDefault()
    // The search will automatically trigger when searchId updates
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading produce information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="mb-8">
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-900">Trace Produce</h1>
            <p className="text-gray-600">Enter a Traceability ID to view complete supply chain information</p>
          </Card.Header>
          
          <Card.Content>
            <form onSubmit={handleSearch} className="flex gap-4">
              <input
                type="number"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Traceability ID (e.g., 1, 2, 3...)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Search
              </button>
            </form>
          </Card.Content>
        </Card>

        {error && (
          <Card>
            <Card.Content className="text-center py-8">
              <p className="text-red-600">Failed to load produce data. Please check the ID and try again.</p>
            </Card.Content>
          </Card>
        )}

        {produceData && (
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Produce Information</h2>
              </Card.Header>
              <Card.Content>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <Package className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Product Name</p>
                      <p className="font-semibold">{produceData[0]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Origin Farm</p>
                      <p className="font-semibold">{produceData[1]}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Harvest Date</p>
                      <p className="font-semibold">
                        {format(new Date(Number(produceData[3]) * 1000), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Current Price</p>
                      <p className="font-semibold">{(Number(produceData[5]) / 10**18).toFixed(4)} MATIC</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {produceData[2]}
                    </span>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getStatusText(Number(produceData[6]))}
                    </span>
                  </div>
                </div>
              </Card.Content>
            </Card>

            {/* Supply Chain Trail */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-semibold text-gray-900">Supply Chain Trail</h2>
              </Card.Header>
              <Card.Content>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500">Current Owner</p>
                      <p className="font-mono text-sm">{produceData[4]}</p>
                    </div>
                  </div>
                  
                  {produceData[7] && produceData[7].length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Ownership History</p>
                      <div className="space-y-2">
                        {produceData[7].map((owner, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                            <p className="font-mono text-sm">{owner}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card.Content>
            </Card>

            {/* Images */}
            {produceData[8] && produceData[8].length > 0 && (
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-semibold text-gray-900">Images</h2>
                </Card.Header>
                <Card.Content>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {produceData[8].map((uri, index) => (
                      <div key={index} className="border border-gray-200 rounded-md p-4 text-center">
                        <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500 break-all">{uri}</p>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TracePage