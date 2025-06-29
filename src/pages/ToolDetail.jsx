import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, Settings, ExternalLink, Download, Code } from 'lucide-react'
import { useAITools } from '../context/AIToolsContext'

const ToolDetail = () => {
  const { toolName } = useParams()
  const { aiTools } = useAITools()
  const [toolsContent, setToolsContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  const tool = aiTools.find(t => t.id === toolName)

  useEffect(() => {
    const loadToolsContent = async () => {
      try {
        setLoading(true)
        
        // Map tool IDs to their actual tool files
        const toolFiles = {
          'v0': '/v0 Prompts and Tools/Tools.json',
          'windsurf': '/Windsurf/Tools.json',
          'replit': '/Replit/Tools.json',
          'manus': '/Manus Agent Tools & Prompt/tools.json'
        }

        const filePath = toolFiles[toolName]
        if (filePath) {
          const response = await fetch(filePath)
          if (response.ok) {
            const content = await response.text()
            setToolsContent(content)
            
            // Try to parse and set the first tool as selected
            try {
              const parsed = JSON.parse(content)
              if (parsed.tools && parsed.tools.length > 0) {
                setSelectedTool(parsed.tools[0])
              } else if (Array.isArray(parsed) && parsed.length > 0) {
                setSelectedTool(parsed[0])
              }
            } catch (e) {
              console.error('Error parsing tools JSON:', e)
            }
          } else {
            setToolsContent('Tool configuration not available for this tool.')
          }
        } else {
          setToolsContent('Tool configuration not available for this tool.')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading tools:', error)
        setToolsContent('Error loading tool configuration.')
        setLoading(false)
      }
    }

    if (toolName) {
      loadToolsContent()
    }
  }, [toolName])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(toolsContent)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!tool) {
    return (
      <div className="text-center py-12">
        <div className="text-white/40 text-lg">Tool not found</div>
        <Link to="/" className="text-blue-400 hover:text-blue-300 mt-4 inline-block">
          ← Back to Home
        </Link>
      </div>
    )
  }

  let parsedTools = null
  try {
    if (toolsContent) {
      const parsed = JSON.parse(toolsContent)
      if (parsed.tools) {
        parsedTools = parsed
      } else if (Array.isArray(parsed)) {
        parsedTools = { tools: parsed }
      }
    }
  } catch (e) {
    // Invalid JSON, keep parsedTools as null
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-xl sm:text-2xl`}>
              {tool.icon}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{tool.name} Tools</h1>
              <p className="text-white/60 text-sm sm:text-base">{tool.company}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm sm:text-base"
          >
            {copied ? <Check size={14} className="sm:w-4 sm:h-4" /> : <Copy size={14} className="sm:w-4 sm:h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors text-sm sm:text-base">
            <Download size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Download</span>
          </button>
        </div>
      </motion.div>

      {/* Tool Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-4 sm:p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <h3 className="text-white font-semibold mb-2">Description</h3>
            <p className="text-white/80 text-sm">{tool.description}</p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-2">Category</h3>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm rounded-full">
              {tool.category}
            </span>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-2">Available Tools</h3>
            <div className="text-xl sm:text-2xl font-bold text-white">
              {parsedTools ? parsedTools.tools?.length || 0 : 0}
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-effect rounded-xl p-6 sm:p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white/60">Loading tool configuration...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Tools List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-4 sm:p-6"
          >
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-purple-400" />
              <span>Available Tools</span>
            </h3>
            
            {parsedTools?.tools ? (
              <div className="space-y-3">
                {parsedTools.tools.map((toolItem, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTool(toolItem)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedTool?.name === toolItem.name
                        ? 'bg-purple-500/20 border border-purple-500/30'
                        : 'bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium text-white text-sm">{toolItem.name || toolItem.function?.name || `Tool ${index + 1}`}</div>
                    <div className="text-white/60 text-xs mt-1 line-clamp-2">
                      {toolItem.description || toolItem.function?.description || 'No description available'}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-white/60 text-sm">No tools available</div>
            )}
          </motion.div>

          {/* Tool Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 glass-effect rounded-xl overflow-hidden"
          >
            {selectedTool ? (
              <>
                <div className="p-4 sm:p-6 border-b border-white/10">
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                    {selectedTool.name || selectedTool.function?.name || 'Tool Details'}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {selectedTool.description || selectedTool.function?.description || 'No description available'}
                  </p>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span>Parameters Schema</span>
                  </h4>
                  
                  <pre className="bg-slate-900/50 rounded-lg p-4 text-xs sm:text-sm text-white/90 font-mono overflow-x-auto scrollbar-thin">
                    <code>{JSON.stringify(selectedTool.parameters || selectedTool.function?.parameters || {}, null, 2)}</code>
                  </pre>
                </div>
              </>
            ) : (
              <div className="p-6 sm:p-8 text-center">
                <Settings className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <div className="text-white/60">Select a tool to view its details</div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Raw Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-effect rounded-xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-white/10 gap-2">
          <div className="flex items-center space-x-2">
            <Code className="w-5 h-5 text-purple-400" />
            <span className="text-white font-semibold">Raw Configuration</span>
          </div>
          
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <span>{toolsContent.split('\n').length} lines</span>
            <span>•</span>
            <span>{toolsContent.length} characters</span>
          </div>
        </div>

        <pre className="p-4 sm:p-6 text-xs sm:text-sm text-white/90 font-mono overflow-x-auto scrollbar-thin bg-slate-900/50">
          <code>{toolsContent}</code>
        </pre>
      </motion.div>

      {/* Related Resources */}
      {tool.hasPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-white font-semibold mb-4">Related Resources</h3>
          <Link
            to={`/prompt/${tool.id}`}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">System Prompt</div>
              <div className="text-white/60 text-sm">View the complete system prompt</div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default ToolDetail