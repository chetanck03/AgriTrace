import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useReadContracts } from 'wagmi'
import { contractABI, contractAddress } from '../lib/contract'
import toast from 'react-hot-toast'

const Web3Context = createContext({
  // Wallet state
  address: null,
  isConnected: false,
  chainId: null,
  
  // User state
  userRole: null,
  isLoading: false,
  
  // Contract functions
  registerUser: () => {},
  registerProduce: () => {},
  transferProduce: () => {},
  claimProduce: () => {},
  traceProduce: () => {},
  
  // Data
  myProduceItems: [],
  refreshData: () => {}
})

export const useWeb3 = () => {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider')
  }
  return context
}

export const Web3Provider = ({ children }) => {
  const { address, isConnected, chainId, status } = useAccount()
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [myProduceItems, setMyProduceItems] = useState([])
  
  const { writeContract, isPending, error: writeError } = useWriteContract()

  // Handle connection errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError)
      toast.error('Transaction failed: ' + (writeError.message || 'Unknown error'))
    }
  }, [writeError])

  // Handle account status changes
  useEffect(() => {
    if (status === 'connecting') {
      setIsLoading(true)
    } else if (status === 'connected') {
      setIsLoading(false)
      toast.success('Wallet connected successfully!')
    } else if (status === 'disconnected') {
      setIsLoading(false)
      setUserRole(null)
      setMyProduceItems([])
    }
  }, [status])

  // Read user role from contract
  const { data: roleData, refetch: refetchRole, error: roleError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'userRoles',
    args: address ? [address] : undefined,
    enabled: !!address && isConnected,
    retry: 3
  })

  // Read user's produce items
  const { data: produceIds, refetch: refetchProduce, error: produceError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'myProduce',
    enabled: !!address && !!userRole && isConnected,
    retry: 3
  })

  // Handle contract read errors
  useEffect(() => {
    if (roleError) {
      console.error('Role read error:', roleError)
      // Don't show toast for role errors as user might not be registered yet
    }
    if (produceError) {
      console.error('Produce read error:', produceError)
    }
  }, [roleError, produceError])

  useEffect(() => {
    if (roleData !== undefined) {
      setUserRole(Number(roleData))
    }
  }, [roleData])

  useEffect(() => {
    if (produceIds) {
      setMyProduceItems(produceIds.map(id => Number(id)))
    }
  }, [produceIds])

  const registerUser = async (role) => {
    try {
      setIsLoading(true)
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'registerUser',
        args: [role]
      })
      toast.success('User registered successfully!')
      await refetchRole()
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to register user')
    } finally {
      setIsLoading(false)
    }
  }

  const registerProduce = async (produceData) => {
    try {
      setIsLoading(true)
      const { name, originFarm, grade, price, imageURIs } = produceData
      
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'registerProduce',
        args: [name, originFarm, grade, price, imageURIs]
      })
      toast.success('Produce registered successfully!')
      await refetchProduce()
    } catch (error) {
      console.error('Produce registration error:', error)
      toast.error('Failed to register produce')
    } finally {
      setIsLoading(false)
    }
  }

  const transferProduce = async (produceId, toAddress) => {
    try {
      setIsLoading(true)
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'requestTransfer',
        args: [produceId, toAddress]
      })
      toast.success('Transfer request sent!')
    } catch (error) {
      console.error('Transfer error:', error)
      toast.error('Failed to request transfer')
    } finally {
      setIsLoading(false)
    }
  }

  const claimProduce = async (produceId, newPrice, newStatus) => {
    try {
      setIsLoading(true)
      await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'claimProduce',
        args: [produceId, newPrice, newStatus]
      })
      toast.success('Produce claimed successfully!')
      await refetchProduce()
    } catch (error) {
      console.error('Claim error:', error)
      toast.error('Failed to claim produce')
    } finally {
      setIsLoading(false)
    }
  }

  const traceProduce = async (produceId) => {
    try {
      // This will be handled by useReadContract hook in components
      return { produceId }
    } catch (error) {
      console.error('Trace error:', error)
      toast.error('Failed to trace produce')
      return null
    }
  }

  const refreshData = async () => {
    await Promise.all([refetchRole(), refetchProduce()])
  }

  const value = {
    // Wallet state
    address,
    isConnected,
    chainId,
    
    // User state
    userRole,
    isLoading: isLoading || isPending,
    
    // Contract functions
    registerUser,
    registerProduce,
    transferProduce,
    claimProduce,
    traceProduce,
    
    // Data
    myProduceItems,
    refreshData
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}