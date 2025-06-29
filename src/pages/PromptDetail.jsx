import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Copy, Check, FileText, ExternalLink, Download } from 'lucide-react'
import { useAITools } from '../context/AIToolsContext'

const PromptDetail = () => {
  const { toolName } = useParams()
  const { aiTools } = useAITools()
  const [promptContent, setPromptContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  const tool = aiTools.find(t => t.id === toolName)

  useEffect(() => {
    const loadPromptContent = async () => {
      try {
        setLoading(true)
        
        // Map tool IDs to their actual file paths
        const promptFiles = {
          'v0': '/v0 Prompts and Tools/Prompt.txt',
          'cursor': '/Cursor Prompts/Agent Prompt.txt',
          'windsurf': '/Windsurf/Prompt.txt',
          'bolt': '/Open Source prompts/Bolt/Prompt.txt',
          'cline': '/Open Source prompts/Cline/Prompt.txt',
          'devin': '/Devin AI/Prompt.txt',
          'replit': '/Replit/Prompt.txt',
          'same-dev': '/Same.dev/Prompt.txt',
          'manus': '/Manus Agent Tools & Prompt/Prompt.txt',
          'vscode-agent': '/VSCode Agent/Prompt.txt',
          'dia': '/dia/Prompt.txt',
          'trae': '/Trae/Chat Prompt.txt',
          'cluely': '/Cluely/Default Prompt.txt',
          'spawn': '/Spawn/Prompt.txt',
          'junie': '/Junie/Prompt.txt',
          'roocode': '/Open Source prompts/RooCode/Prompt.txt',
          'codex-cli': '/Open Source prompts/Codex CLI/Prompt.txt'
        }

        const filePath = promptFiles[toolName]
        if (filePath) {
          const response = await fetch(filePath)
          if (response.ok) {
            const content = await response.text()
            setPromptContent(content)
          } else {
            setPromptContent('Prompt content not available for this tool.')
          }
        } else {
          setPromptContent('Prompt content not available for this tool.')
        }
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading prompt:', error)
        setPromptContent('Error loading prompt content.')
        setLoading(false)
      }
    }

    if (toolName) {
      loadPromptContent()
    }
  }, [toolName])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(promptContent)
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
              <h1 className="text-xl sm:text-2xl font-bold text-white">{tool.name} System Prompt</h1>
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
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-sm rounded-full">
              {tool.category}
            </span>
          </div>
          
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-2">Key Features</h3>
            <div className="flex flex-wrap gap-2">
              {tool.features.slice(0, 4).map((feature, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-white/10 text-white/70 text-xs rounded-md"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prompt Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-effect rounded-xl overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border-b border-white/10 gap-2">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span className="text-white font-semibold">System Prompt</span>
          </div>
          
          <div className="flex items-center space-x-2 text-white/60 text-sm">
            <span>{promptContent.split('\n').length} lines</span>
            <span>•</span>
            <span>{promptContent.length} characters</span>
          </div>
        </div>

        <div className="relative">
          {loading ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-white/60">Loading prompt content...</div>
            </div>
          ) : (
            <pre className="p-4 sm:p-6 text-xs sm:text-sm text-white/90 font-mono overflow-x-auto scrollbar-thin bg-slate-900/50">
              <code>{promptContent}</code>
            </pre>
          )}
        </div>
      </motion.div>

      {/* Related Tools */}
      {tool.hasTools && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-4 sm:p-6"
        >
          <h3 className="text-white font-semibold mb-4">Related Resources</h3>
          <Link
            to={`/tool/${tool.id}`}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-medium">Tool Configuration</div>
              <div className="text-white/60 text-sm">View available tools and schemas</div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default PromptDetail