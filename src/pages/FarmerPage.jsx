import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useWeb3 } from '../contexts/Web3Context'
import { UserRole } from '../lib/contract'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Plus, Upload } from 'lucide-react'

const FarmerPage = () => {
  const { registerProduce, isLoading, userRole } = useWeb3()
  const [images, setImages] = useState([])
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    try {
      // Convert price to wei (for demo, using simple conversion)
      const priceInWei = BigInt(data.price) * BigInt(10**18)
      
      await registerProduce({
        name: data.name,
        originFarm: data.originFarm,
        grade: data.grade,
        price: priceInWei,
        imageURIs: images.length > 0 ? images : ['ipfs://placeholder']
      })
      
      reset()
      setImages([])
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  if (userRole !== UserRole.FARMER) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <Card>
            <Card.Content className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600">Only registered farmers can access this page.</p>
            </Card.Content>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <Card.Header>
            <h1 className="text-2xl font-bold text-gray-900">Register New Produce</h1>
            <p className="text-gray-600">Add your harvested produce to the blockchain</p>
          </Card.Header>
          
          <Card.Content>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Produce Name
                </label>
                <input
                  {...register('name', { required: 'Produce name is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Organic Tomatoes"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin Farm
                </label>
                <input
                  {...register('originFarm', { required: 'Origin farm is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Green Valley Farm, California"
                />
                {errors.originFarm && (
                  <p className="mt-1 text-sm text-red-600">{errors.originFarm.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade
                </label>
                <select
                  {...register('grade', { required: 'Grade is required' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Grade</option>
                  <option value="A+">A+ (Premium)</option>
                  <option value="A">A (High Quality)</option>
                  <option value="B">B (Standard)</option>
                  <option value="C">C (Commercial)</option>
                </select>
                {errors.grade && (
                  <p className="mt-1 text-sm text-red-600">{errors.grade.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (MATIC)
                </label>
                <input
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0.001, message: 'Price must be at least 0.001 MATIC' }
                  })}
                  type="number"
                  step="0.001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="0.00"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Upload images or add IPFS URIs</p>
                  <input
                    type="text"
                    placeholder="ipfs://... (optional)"
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md"
                    onBlur={(e) => {
                      if (e.target.value && !images.includes(e.target.value)) {
                        setImages([...images, e.target.value])
                        e.target.value = ''
                      }
                    }}
                  />
                </div>
                {images.length > 0 && (
                  <div className="mt-2 text-sm text-green-600">
                    {images.length} image(s) added
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                loading={isLoading} 
                className="w-full"
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register Produce
              </Button>
            </form>
          </Card.Content>
        </Card>
      </div>
    </div>
  )
}

export default FarmerPage