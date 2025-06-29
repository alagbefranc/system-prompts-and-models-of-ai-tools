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
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl font-bold text-white mb-4">
          AI System Prompts
          <span className="gradient-text block">Explorer</span>
        </h1>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          Comprehensive collection of system prompts and tools from leading AI coding assistants. 
          Explore over 7500+ lines of insights into their structure and functionality.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mt-8">
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
              className="glass-effect rounded-lg p-4 text-center"
            >
              <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-sm text-white/60">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search AI tools, companies, or features..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {categories.map(category => (
              <option key={category} value={category} className="bg-slate-800">
                {category}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-effect rounded-xl p-6 hover:bg-white/15 transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-2xl`}>
                  {tool.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-blue-300 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-white/60 text-sm">{tool.company}</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                {tool.category}
              </span>
            </div>

            <p className="text-white/80 text-sm mb-4 line-clamp-2">
              {tool.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {tool.features.slice(0, 3).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
              {tool.features.length > 3 && (
                <span className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md">
                  +{tool.features.length - 3} more
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {tool.hasPrompt && (
                  <Link
                    to={`/prompt/${tool.id}`}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                  >
                    <FileText size={14} />
                    <span>Prompt</span>
                  </Link>
                )}
                {tool.hasTools && (
                  <Link
                    to={`/tool/${tool.id}`}
                    className="flex items-center space-x-1 px-3 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                  >
                    <Code size={14} />
                    <span>Tools</span>
                  </Link>
                )}
              </div>
              
              {!tool.hasPrompt && !tool.hasTools && (
                <span className="text-white/40 text-sm">Coming Soon</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-white/40 text-lg">No tools found matching your criteria</div>
          <p className="text-white/30 mt-2">Try adjusting your search or filter</p>
        </motion.div>
      )}
    </div>
  )
}

export default Home