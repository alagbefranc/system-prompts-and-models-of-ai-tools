import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, FileText, Settings, ExternalLink, Code, Zap } from 'lucide-react'
import { useAITools } from '../context/AIToolsContext'

const Home = () => {
  const { aiTools } = useAITools()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(aiTools.map(tool => tool.category))]

  const filteredTools = aiTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const stats = {
    totalTools: aiTools.length,
    withPrompts: aiTools.filter(tool => tool.hasPrompt).length,
    withTools: aiTools.filter(tool => tool.hasTools).length,
    categories: categories.length - 1
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 sm:space-y-6"
      >
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          AI System Prompts
          <span className="gradient-text block">Explorer</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          Comprehensive collection of system prompts and tools from leading AI coding assistants. 
          Explore over 7500+ lines of insights into their structure and functionality.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-6 sm:mt-8 px-4">
          {[
            { label: 'AI Tools', value: stats.totalTools, icon: Zap },
            { label: 'System Prompts', value: stats.withPrompts, icon: FileText },
            { label: 'Tool Configs', value: stats.withTools, icon: Settings },
            { label: 'Categories', value: stats.categories, icon: Filter }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="glass-effect rounded-lg p-3 sm:p-4 text-center"
            >
              <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-4 sm:p-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search AI tools, companies, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-w-0 sm:min-w-[120px]"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-white text-sm sm:text-base">
                {category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-lg sm:text-2xl flex-shrink-0`}>
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                    {tool.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm truncate">{tool.company}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full whitespace-nowrap ml-2">
                {tool.category}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 sm:mb-4 line-clamp-2">
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                  +{tool.features.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tool.hasPrompt && (
                  <Link
                    to={`/prompt/${tool.id}`}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm"
                  >
                    <FileText size={12} className="sm:w-4 sm:h-4" />
                    <span>Prompt</span>
                  </Link>
                )}
                {tool.hasTools && (
                  <Link
                    to={`/tool/${tool.id}`}
                    className="flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-xs sm:text-sm"
                  >
                    <Code size={12} className="sm:w-4 sm:h-4" />
                    <span>Tools</span>
                  </Link>
                )}
              </div>
              
              {!tool.hasPrompt && !tool.hasTools && (
                <span className="text-gray-400 text-xs sm:text-sm">Coming Soon</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 sm:py-12"
        >
          <div className="text-gray-400 text-lg">No tools found matching your criteria</div>
          <p className="text-gray-300 mt-2">Try adjusting your search or filter</p>
        </motion.div>
      )}
    </div>
  )
}

export default Home