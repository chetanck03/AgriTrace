import React, { useState } from 'react'
import { useWeb3 } from '../../contexts/Web3Context'
import { UserRole, getUserRoleText } from '../../lib/contract'
import Card from './Card'
import Button from './Button'
import { User, Truck, Store, ShoppingCart, Loader2, RefreshCw } from 'lucide-react'

const ChangeRole = ({ currentRole, userAddress }) => {
  const { changeUserRole, isLoading } = useWeb3()
  const [selectedRole, setSelectedRole] = useState(null)
  const [targetAddress, setTargetAddress] = useState(userAddress || '')

  const roles = [
    {
      id: UserRole.FARMER,
      name: 'Farmer',
      description: 'Register and manage agricultural produce',
      icon: User,
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      id: UserRole.DISTRIBUTOR,
      name: 'Distributor',
      description: 'Handle logistics and transportation',
      icon: Truck,
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      id: UserRole.RETAILER,
      name: 'Retailer',
      description: 'Sell produce to consumers',
      icon: Store,
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: UserRole.CONSUMER,
      name: 'Consumer',
      description: 'Track and verify produce authenticity',
      icon: ShoppingCart,
      color: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  ]

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId)
  }

  const handleChangeRole = async () => {
    if (selectedRole && targetAddress) {
      await changeUserRole(targetAddress, selectedRole)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Change User Role</h2>
          <p className="text-gray-600 text-center mt-2">
            {currentRole ? `Current role: ${getUserRoleText(currentRole)}` : 'Select a new role for the user'}
          </p>
        </Card.Header>
        <Card.Content>
          {/* Address Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Address
            </label>
            <input
              type="text"
              value={targetAddress}
              onChange={(e) => setTargetAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id
              const isCurrent = currentRole === role.id
              
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`
                    p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 relative
                    ${isSelected 
                      ? `${role.color} border-opacity-100 shadow-md` 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                    ${isCurrent ? 'ring-2 ring-yellow-400' : ''}
                  `}
                >
                  {isCurrent && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-1 rounded-full font-medium">
                      Current
                    </div>
                  )}
                  <div className="flex items-center space-x-4">
                    <div className={`
                      p-3 rounded-full
                      ${isSelected ? 'bg-white bg-opacity-50' : 'bg-white'}
                    `}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      <p className={`text-sm ${isSelected ? 'opacity-90' : 'text-gray-600'}`}>
                        {role.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="text-center">
            <Button
              onClick={handleChangeRole}
              disabled={!selectedRole || !targetAddress || isLoading}
              className="px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Changing Role...
                </>
              ) : (
                <>
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Change Role to {selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'Selected Role'}
                </>
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Only authorized users can change roles</li>
              <li>• Role changes are permanent and recorded on blockchain</li>
              <li>• Make sure the address is correct before proceeding</li>
              <li>• The user will get access to new role-specific features</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default ChangeRole
