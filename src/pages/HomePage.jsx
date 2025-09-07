import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, Truck, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { useWeb3 } from '../contexts/Web3Context'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const HomePage = () => {
  const { isConnected } = useWeb3()

  const features = [
    {
      icon: Shield,
      title: 'Blockchain Security',
      description: 'Immutable records ensure data integrity and prevent fraud'
    },
    {
      icon: Eye,
      title: 'Complete Transparency',
      description: 'Track produce from farm to consumer with full visibility'
    },
    {
      icon: Truck,
      title: 'Supply Chain Tracking',
      description: 'Real-time updates at every stage of the supply chain'
    },
    {
      icon: Users,
      title: 'Multi-Stakeholder',
      description: 'Farmers, distributors, retailers, and consumers all connected'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transparent Agriculture
              <span className="block text-green-200">Supply Chain</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Ensuring fair pricing, quality verification, and complete traceability 
              from farm to consumer using blockchain technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isConnected ? (
                <Link to="/dashboard">
                  <Button size="lg" variant="primary" className="bg-black text-white hover:bg-gray-100">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                <Button size="lg" variant="primary" className="bg-black text-white hover:bg-gray-100">
                  Connect Wallet to Start
                </Button>
              )}
              <Link to="/consumer">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
                  Trace Produce
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why AgriTrace?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary blockchain technology that brings trust and transparency to agricultural supply chains
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center h-full">
                  <Card.Content className="pt-8">
                    <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Card.Content>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Agriculture?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of farmers, distributors, and retailers building a more transparent future
            </p>
            {!isConnected && (
              <Button size="lg" variant="primary">
                Get Started Today
              </Button>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage