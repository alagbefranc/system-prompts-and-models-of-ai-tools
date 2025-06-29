import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wand2, Copy, Check, Download, Sparkles, Settings, Brain, Code, Palette, Bug } from 'lucide-react'
import PromptGenerator from '../services/promptGenerator'

const PromptGeneratorComponent = () => {
  const [userIdea, setUserIdea] = useState('')
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [promptType, setPromptType] = useState('comprehensive')
  const [focusArea, setFocusArea] = useState('general')

  const promptGenerator = new PromptGenerator()

  const handleGenerate = async () => {
    if (!userIdea.trim()) return

    setLoading(true)
    
    // Simulate processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1500))

    try {
      let result
      if (promptType === 'comprehensive') {
        result = promptGenerator.generateComprehensivePrompt(userIdea)
      } else {
        result = promptGenerator.generateFocusedPrompt(userIdea, focusArea)
      }
      
      setGeneratedPrompt(result)
    } catch (error) {
      console.error('Error generating prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async () => {
    if (!generatedPrompt) return
    
    try {
      await navigator.clipboard.writeText(generatedPrompt.prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const downloadPrompt = () => {
    if (!generatedPrompt) return

    const blob = new Blob([generatedPrompt.prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ai-prompt-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const focusAreaIcons = {
    general: Brain,
    coding: Code,
    design: Palette,
    architecture: Settings,
    debugging: Bug
  }

  const FocusIcon = focusAreaIcons[focusArea] || Brain

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Wand2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">AI Prompt Generator</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Combine the power of all AI system prompts to create comprehensive, tailored prompts for any idea or project.
        </p>
      </motion.div>

      {/* Input Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-xl p-6"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="user-idea" className="block text-sm font-medium text-gray-700 mb-2">
              Describe your idea or project
            </label>
            <textarea
              id="user-idea"
              value={userIdea}
              onChange={(e) => setUserIdea(e.target.value)}
              placeholder="e.g., Build a responsive e-commerce website with React and Node.js, Create a mobile app for task management, Develop an AI-powered chatbot..."
              className="w-full h-32 px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Prompt Type Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prompt Type
              </label>
              <select
                value={promptType}
                onChange={(e) => setPromptType(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="comprehensive">Comprehensive (Detailed)</option>
                <option value="focused">Focused (Concise)</option>
              </select>
            </div>

            {promptType === 'focused' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Focus Area
                </label>
                <select
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="general">General Assistant</option>
                  <option value="coding">Coding Expert</option>
                  <option value="design">Design Expert</option>
                  <option value="architecture">Architecture Expert</option>
                  <option value="debugging">Debugging Expert</option>
                </select>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerate}
            disabled={!userIdea.trim() || loading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Generating Prompt...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate AI Prompt</span>
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Generated Prompt */}
      {generatedPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {/* Metadata */}
          <div className="glass-effect rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <FocusIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {promptType === 'comprehensive' ? 'Comprehensive Prompt' : `Focused: ${focusArea}`}
                  </span>
                </div>
                {generatedPrompt.analysis.domains.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {generatedPrompt.analysis.domains.map((domain, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {domain.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">
                  {generatedPrompt.metadata.promptLength} chars • ~{generatedPrompt.metadata.estimatedTokens} tokens
                </span>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  <span className="text-sm">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
                <button
                  onClick={downloadPrompt}
                  className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <Download size={16} />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          </div>

          {/* Prompt Content */}
          <div className="glass-effect rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800">Generated AI Prompt</h3>
            </div>
            <div className="p-6">
              <pre className="text-sm text-gray-800 font-mono whitespace-pre-wrap overflow-x-auto scrollbar-thin">
                {generatedPrompt.prompt}
              </pre>
            </div>
          </div>

          {/* Analysis Details */}
          {generatedPrompt.analysis.technologies.length > 0 && (
            <div className="glass-effect rounded-xl p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Detected Technologies</h4>
              <div className="flex flex-wrap gap-2">
                {generatedPrompt.analysis.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default PromptGeneratorComponent