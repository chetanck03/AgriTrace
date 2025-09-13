import { useAccount, useDisconnect, useBalance } from 'wagmi'
import { useAppKit } from '@reown/appkit/react'
import { LogOut, Wallet, Globe } from 'lucide-react'
import { useState } from 'react'

const WalletConnect = () => {
  const { address, isConnected, chain } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useAppKit()
  const [isConnecting, setIsConnecting] = useState(false)
  
  // Get wallet balance
  const { data: balance } = useBalance({
    address: address,
    enabled: !!address && isConnected
  })

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      await open()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
  }

  const formatAddress = (addr) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatBalance = (balance) => {
    if (!balance) return '0.00'
    const value = parseFloat(balance.formatted)
    return value.toFixed(4)
  }

  const getNetworkName = (chain) => {
    if (!chain) return 'Unknown'
    return chain.name || 'Unknown Network'
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        {/* Network Information */}
        <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
          <Globe className="h-3 w-3" />
          <span>{getNetworkName(chain)}</span>
        </div>
        
        {/* Wallet Balance */}
        <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
          {formatBalance(balance)} {balance?.symbol || 'ETH'}
        </div>
        
        {/* Wallet Address */}
        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {formatAddress(address)}
        </div>
        
        <button
          onClick={handleDisconnect}
          className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
          title="Disconnect Wallet"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      <Wallet className="h-4 w-4" />
      <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  )
}

export default WalletConnect