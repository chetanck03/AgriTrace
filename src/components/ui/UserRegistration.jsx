import React, { useState } from 'react'
import { useWeb3 } from '../../contexts/Web3Context'
import { UserRole } from '../../lib/contract'
import Card from './Card'
import Button from './Button'
import ChangeRole from './ChangeRole'
import { User, Truck, Store, ShoppingCart, Loader2, RefreshCw } from 'lucide-react'

const UserRegistration = () => {
  const { registerUser, isLoading, address, userRole } = useWeb3()
  const [selectedRole, setSelectedRole] = useState(null)
  const [showChangeRole, setShowChangeRole] = useState(false)

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

  const handleRegister = async () => {
    if (selectedRole) {
      await registerUser(selectedRole)
    }
  }

  // If user is already registered, show change role directly
  if (userRole && userRole !== 0) {
    return <ChangeRole currentRole={userRole} userAddress={address} />
  }

  if (showChangeRole) {
    return <ChangeRole currentRole={userRole} userAddress={address} />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <Card.Header>
          <h2 className="text-2xl font-bold text-gray-900 text-center">Welcome to AgriTrace</h2>
          <p className="text-gray-600 text-center mt-2">
            Please select your role to get started with the platform
          </p>
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setShowChangeRole(true)}
              className="text-sm text-blue-600 hover:text-blue-800 underline flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Change Role Instead
            </button>
          </div>
        </Card.Header>
        <Card.Content>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {roles.map((role) => {
              const IconComponent = role.icon
              const isSelected = selectedRole === role.id
              
              return (
                <div
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`
                    p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? `${role.color} border-opacity-100 shadow-md` 
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
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
              onClick={handleRegister}
              disabled={!selectedRole || isLoading}
              className="px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Registering...
                </>
              ) : (
                'Register as ' + (selectedRole ? roles.find(r => r.id === selectedRole)?.name : 'User')
              )}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your role will be registered on the blockchain</li>
              <li>• You'll get access to role-specific features</li>
              <li>• You can start using AgriTrace immediately</li>
            </ul>
          </div>
        </Card.Content>
      </Card>
    </div>
  )
}

export default UserRegistration
