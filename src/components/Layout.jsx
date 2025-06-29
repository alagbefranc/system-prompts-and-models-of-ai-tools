import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Github, Star } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <nav className="glass-effect border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              >
                <span className="text-white font-bold">AI</span>
              </motion.div>
              <span className="text-white font-semibold text-lg">System Prompts Explorer</span>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white/20 text-white' 
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home size={18} />
                <span>Home</span>
              </Link>
              
              <a
                href="https://github.com/x1xhlol/system-prompts-and-models-of-ai-tools"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
              
              <div className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-yellow-500/20 text-yellow-300">
                <Star size={16} />
                <span className="text-sm font-medium">7500+ Lines</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="border-t border-white/10 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-white/60">
            <p className="mb-2">
              AI System Prompts & Models Collection
            </p>
            <p className="text-sm">
              Insights into the structure and functionality of leading AI tools
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout