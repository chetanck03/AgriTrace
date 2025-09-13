import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useReadContracts, useWaitForTransactionReceipt } from 'wagmi'
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
  changeUserRole: () => {},
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
  const [txHash, setTxHash] = useState(null)
  
  const { writeContract, isPending, error: writeError, data: writeData } = useWriteContract()
  
  // Wait for transaction confirmation
  const { isLoading: isConfirming, isSuccess: isConfirmed, isError: txError } = useWaitForTransactionReceipt({
    hash: txHash,
    enabled: !!txHash
  })

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
      setTxHash(null)
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

  // Test contract accessibility by reading produceCount
  const { data: produceCountData, error: contractError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'produceCount',
    enabled: !!address && isConnected,
    retry: 1
  })

  // Read user's produce items
  const { data: produceIds, refetch: refetchProduce, error: produceError } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: 'myProduce',
    enabled: !!address && !!userRole && isConnected,
    retry: 3
  })

  // Handle transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash) {
      console.log('Transaction confirmed, refetching role data...')
      // Transaction confirmed, refetch role data
      const refetchAndUpdate = async () => {
        try {
          await refetchRole()
          console.log('Role refetched successfully')
          toast.success('Registration confirmed! Welcome to AgriTrace!')
        } catch (error) {
          console.error('Error refetching role:', error)
          // Force a page refresh if refetch fails
          window.location.reload()
        }
      }
      
      setTimeout(refetchAndUpdate, 2000) // Increased delay for blockchain state update
      setTxHash(null)
      setIsLoading(false)
    }
  }, [isConfirmed, txHash, refetchRole])

  // Also clear loading when transaction fails
  useEffect(() => {
    if ((writeError || txError) && txHash) {
      setIsLoading(false)
      setTxHash(null)
      if (txError) {
        toast.error('Transaction failed to confirm')
      }
    }
  }, [writeError, txError, txHash])

  // Handle contract read errors
  useEffect(() => {
    if (roleError) {
      console.error('Role read error:', roleError)
      // Don't show toast for role errors as user might not be registered yet
    }
    if (produceError) {
      console.error('Produce read error:', produceError)
    }
    if (contractError) {
      console.error('Contract accessibility error:', contractError)
      toast.error('Contract not accessible. Please check if you are on Polygon Amoy network.')
    }
  }, [roleError, produceError, contractError])

  useEffect(() => {
    if (roleData !== undefined) {
      const newRole = Number(roleData)
      console.log('Role data updated:', newRole)
      setUserRole(newRole)
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
      
      // Check if user is already registered
      if (userRole && userRole !== 0) {
        toast.error('You are already registered!')
        setIsLoading(false)
        return
      }

      // Check if contract is accessible first
      if (contractError) {
        toast.error('Contract not accessible. Please ensure you are connected to Polygon Amoy network.')
        setIsLoading(false)
        return
      }

      // Validate role
      if (!role || role < 1 || role > 4) {
        toast.error('Invalid role selected')
        setIsLoading(false)
        return
      }

      // Check network - Polygon Amoy should be chain ID 80002
      if (chainId && chainId !== 80002) {
        toast.error('Please switch to Polygon Amoy network (Chain ID: 80002)')
        setIsLoading(false)
        return
      }

      console.log('Registering user with role:', role)
      console.log('Contract address:', contractAddress)
      console.log('User address:', address)
      console.log('Chain ID:', chainId)
      console.log('Contract accessible:', !contractError)
      console.log('Produce count:', produceCountData)

      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'registerUser',
        args: [role]
      })
      console.log('Transaction hash:', hash)
      setTxHash(hash)
      toast.success('Registration transaction sent! Waiting for confirmation...')
      
      // Also try immediate refetch after a delay as backup
      setTimeout(async () => {
        console.log('Backup refetch attempt...')
        await refetchRole()
      }, 5000)
    } catch (error) {
      console.error('Registration error:', error)
      console.error('Error details:', {
        message: error.message,
        cause: error.cause,
        data: error.data
      })
      
      // Better error handling
      if (error.message.includes('ContractFunctionRevertedError') || error.message.includes('Internal JSON-RPC error')) {
        toast.error('Contract error: Please ensure you are on Polygon Amoy network and the contract is deployed correctly')
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds for transaction')
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction rejected by user')
      } else {
        toast.error('Registration failed: ' + (error.shortMessage || error.message))
      }
      
      setIsLoading(false)
    }
  }

  const changeUserRole = async (userAddress, newRole) => {
    try {
      setIsLoading(true)
      
      // Validate role
      if (!newRole || newRole < 1 || newRole > 4) {
        toast.error('Invalid role selected')
        setIsLoading(false)
        return
      }

      // Validate address
      if (!userAddress || userAddress.length !== 42) {
        toast.error('Invalid user address')
        setIsLoading(false)
        return
      }

      console.log('Changing user role:', { userAddress, newRole })

      const hash = await writeContract({
        address: contractAddress,
        abi: contractABI,
        functionName: 'changeUserRole',
        args: [userAddress, newRole]
      })
      
      console.log('Change role transaction hash:', hash)
      setTxHash(hash)
      toast.success('Role change transaction sent! Waiting for confirmation...')
      
      // Refetch role data after delay
      setTimeout(async () => {
        console.log('Backup refetch for role change...')
        await refetchRole()
      }, 5000)
    } catch (error) {
      console.error('Change role error:', error)
      
      if (error.message.includes('ContractFunctionRevertedError') || error.message.includes('Internal JSON-RPC error')) {
        toast.error('Role change failed: Please ensure you have permission to change roles')
      } else if (error.message.includes('insufficient funds')) {
        toast.error('Insufficient funds for transaction')
      } else if (error.message.includes('user rejected')) {
        toast.error('Transaction rejected by user')
      } else {
        toast.error('Role change failed: ' + (error.shortMessage || error.message))
      }
      
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
    isLoading: isLoading || isPending || isConfirming,
    
    // Contract functions
    registerUser,
    changeUserRole,
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