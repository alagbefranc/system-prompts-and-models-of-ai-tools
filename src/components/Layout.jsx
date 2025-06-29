import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Github, Star, Menu, X, Wand2 } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      <nav className="glass-effect border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold text-sm">AI</span>
              </motion.div>
              <span className="text-gray-800 font-semibold text-lg hidden sm:block">
                System Prompts Explorer
              </span>
              <span className="text-gray-800 font-semibold text-sm sm:hidden">
                AI Prompts
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>

              <Link
                to="/generator"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/generator' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <Wand2 size={18} />
                <span>Prompt Generator</span>
              </Link>
              
              <a
                href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              
              <div className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700">
                <Star size={16} />
                <span className="text-sm font-medium">7500+ Lines</span>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Home size={18} />
                  <span>Home</span>
                </Link>

                <Link
                  to="/generator"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === '/generator' 
                      ? 'bg-purple-100 text-purple-700' 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Wand2 size={18} />
                  <span>Prompt Generator</span>
                </Link>
                
                <a
                  href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                >
                  <Github size={18} />
                  <span>GitHub</span>
                </a>
                
                <div className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-yellow-100 text-yellow-700 w-fit">
                  <Star size={16} />
                  <span className="text-sm font-medium">7500+ Lines</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>

      <footer className="border-t border-gray-200 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="text-center text-gray-500">
            <p className="mb-2 text-sm sm:text-base">
              AI System Prompts & Models Collection
            </p>
            <p className="text-xs sm:text-sm">
              Insights into the structure and functionality of leading AI tools
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout