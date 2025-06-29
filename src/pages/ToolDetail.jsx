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
        // In a real app, you'd fetch this from your API or file system
        // For demo purposes, we'll show sample content
        const sampleTools = {
          'v0': {
            tools: [
              {
                name: 'create_code_project',
                description: 'Create a new code project with React components',
                parameters: {
                  type: 'object',
                  properties: {
                    id: { type: 'string', description: 'Unique project identifier' },
                    title: { type: 'string', description: 'Project title' },
                    components: { type: 'array', description: 'React components to include' }
                  }
                }
              },
              {
                name: 'quick_edit',
                description: 'Make quick edits to existing code blocks',
                parameters: {
                  type: 'object',
                  properties: {
                    file_path: { type: 'string', description: 'Path to the file to edit' },
                    instructions: { type: 'string', description: 'Edit instructions' }
                  }
                }
              }
            ]
          },
          'windsurf': {
            tools: [
              {
                name: 'edit_file',
                description: 'Edit an existing file with precise code changes',
                parameters: {
                  type: 'object',
                  properties: {
                    TargetFile: { type: 'string', description: 'The target file to modify' },
                    Instruction: { type: 'string', description: 'Description of changes' },
                    CodeEdit: { type: 'string', description: 'Precise lines of code to edit' }
                  }
                }
              },
              {
                name: 'run_command',
                description: 'Execute terminal commands',
                parameters: {
                  type: 'object',
                  properties: {
                    CommandLine: { type: 'string', description: 'Command to execute' },
                    Cwd: { type: 'string', description: 'Working directory' },
                    SafeToAutoRun: { type: 'boolean', description: 'Whether command is safe to auto-run' }
                  }
                }
              },
              {
                name: 'browser_preview',
                description: 'Spin up a browser preview for web servers',
                parameters: {
                  type: 'object',
                  properties: {
                    Url: { type: 'string', description: 'URL of the web server' },
                    Name: { type: 'string', description: 'Short name for the server' }
                  }
                }
              }
            ]
          },
          'replit': {
            tools: [
              {
                name: 'str_replace_editor',
                description: 'Custom editing tool for viewing, creating and editing files',
                parameters: {
                  type: 'object',
                  properties: {
                    command: { type: 'string', enum: ['view', 'create', 'str_replace', 'insert', 'undo_edit'] },
                    path: { type: 'string', description: 'Absolute path to file or directory' },
                    file_text: { type: 'string', description: 'Content for create command' }
                  }
                }
              },
              {
                name: 'packager_tool',
                description: 'Install or uninstall libraries and dependencies',
                parameters: {
                  type: 'object',
                  properties: {
                    install_or_uninstall: { type: 'string', enum: ['install', 'uninstall'] },
                    language_or_system: { type: 'string', description: 'Language or system type' },
                    dependency_list: { type: 'array', items: { type: 'string' } }
                  }
                }
              }
            ]
          },
          'manus': {
            tools: [
              {
                name: 'web_search',
                description: 'Search the web for real-time information',
                parameters: {
                  type: 'object',
                  properties: {
                    search_term: { type: 'string', description: 'Search term to look up' },
                    type: { type: 'string', enum: ['text', 'images'], description: 'Type of search' }
                  }
                }
              },
              {
                name: 'browser_action',
                description: 'Interact with websites through browser automation',
                parameters: {
                  type: 'object',
                  properties: {
                    action: { type: 'string', enum: ['launch', 'click', 'type', 'scroll_down', 'close'] },
                    url: { type: 'string', description: 'URL for launch action' },
                    text: { type: 'string', description: 'Text for type action' }
                  }
                }
              }
            ]
          }
        }

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const toolData = sampleTools[toolName]
        if (toolData) {
          setToolsContent(JSON.stringify(toolData, null, 2))
          setSelectedTool(toolData.tools[0])
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

    loadToolsContent()
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

  const parsedTools = toolsContent ? JSON.parse(toolsContent) : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
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
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.color} flex items-center justify-center text-2xl`}>
              {tool.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{tool.name} Tools</h1>
              <p className="text-white/60">{tool.company}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={copyToClipboard}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 transition-colors">
            <Download size={16} />
            <span>Download</span>
          </button>
        </div>
      </motion.div>

      {/* Tool Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          
          <div>
            <h3 className="text-white font-semibold mb-2">Available Tools</h3>
            <div className="text-2xl font-bold text-white">
              {parsedTools ? parsedTools.tools?.length || 0 : 0}
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="glass-effect rounded-xl p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white/60">Loading tool configuration...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tools List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-effect rounded-xl p-6"
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
                    <div className="font-medium text-white text-sm">{toolItem.name}</div>
                    <div className="text-white/60 text-xs mt-1 line-clamp-2">
                      {toolItem.description}
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
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedTool.name}</h3>
                  <p className="text-white/80 text-sm">{selectedTool.description}</p>
                </div>
                
                <div className="p-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center space-x-2">
                    <Code className="w-4 h-4 text-blue-400" />
                    <span>Parameters Schema</span>
                  </h4>
                  
                  <pre className="bg-slate-900/50 rounded-lg p-4 text-sm text-white/90 font-mono overflow-x-auto scrollbar-thin">
                    <code>{JSON.stringify(selectedTool.parameters, null, 2)}</code>
                  </pre>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
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
        <div className="flex items-center justify-between p-4 border-b border-white/10">
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

        <pre className="p-6 text-sm text-white/90 font-mono overflow-x-auto scrollbar-thin bg-slate-900/50">
          <code>{toolsContent}</code>
        </pre>
      </motion.div>

      {/* Related Resources */}
      {tool.hasPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-effect rounded-xl p-6"
        >
          <h3 className="text-white font-semibold mb-4">Related Resources</h3>
          <Link
            to={`/prompt/${tool.id}`}
            className="flex items-center space-x-3 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-white font-medium">System Prompt</div>
              <div className="text-white/60 text-sm">View the complete system prompt</div>
            </div>
            <ExternalLink className="w-4 h-4 text-white/40 ml-auto" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}

export default ToolDetail