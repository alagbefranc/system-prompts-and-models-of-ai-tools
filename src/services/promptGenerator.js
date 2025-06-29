// AI Prompt Generator Service with Multi-AI Support
import AnthropicClient from './anthropicClient'
import OpenAIClient from './openaiClient'

class PromptGenerator {
  constructor() {
    this.anthropicClient = new AnthropicClient()
    this.openaiClient = new OpenAIClient()
    this.isOnline = navigator.onLine
    
    // Listen for online/offline status
    window.addEventListener('online', () => {
      this.isOnline = true
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
    })
  }

  // Main method to generate prompts using real AI
  async generateComprehensivePrompt(userIdea, preferredProvider = 'auto') {
    try {
      // Try to use real AI first
      if (this.isOnline) {
        const result = await this.generateWithBestAvailableProvider(userIdea, 'comprehensive', 'general', preferredProvider)
        
        if (result) {
          // Add analysis metadata
          const analysis = this.analyzeUserInput(userIdea)
          
          return {
            ...result,
            analysis,
            isRealAI: true
          }
        }
      }
      
      // Fallback to template-based generation
      console.warn('Using fallback prompt generation (API unavailable or offline)')
      return this.generateFallbackPrompt(userIdea, 'comprehensive', 'general')
    } catch (error) {
      console.error('Error generating comprehensive prompt:', error)
      // Fallback on error
      return this.generateFallbackPrompt(userIdea, 'comprehensive', 'general')
    }
  }

  // Generate focused prompts using real AI
  async generateFocusedPrompt(userIdea, focusArea = 'general', preferredProvider = 'auto') {
    try {
      // Try to use real AI first
      if (this.isOnline) {
        const result = await this.generateWithBestAvailableProvider(userIdea, 'focused', focusArea, preferredProvider)
        
        if (result) {
          // Add analysis metadata
          const analysis = this.analyzeUserInput(userIdea)
          
          return {
            ...result,
            analysis,
            isRealAI: true
          }
        }
      }
      
      // Fallback to template-based generation
      console.warn('Using fallback prompt generation (API unavailable or offline)')
      return this.generateFallbackPrompt(userIdea, 'focused', focusArea)
    } catch (error) {
      console.error('Error generating focused prompt:', error)
      // Fallback on error
      return this.generateFallbackPrompt(userIdea, 'focused', focusArea)
    }
  }

  // Smart provider selection and fallback
  async generateWithBestAvailableProvider(userIdea, promptType, focusArea, preferredProvider) {
    const providers = this.getAvailableProviders()
    
    if (providers.length === 0) {
      console.warn('No API providers available, using fallback')
      return null
    }

    // Determine which provider to try first
    let primaryProvider, fallbackProvider
    
    if (preferredProvider === 'anthropic' && providers.includes('anthropic')) {
      primaryProvider = 'anthropic'
      fallbackProvider = providers.find(p => p !== 'anthropic')
    } else if (preferredProvider === 'openai' && providers.includes('openai')) {
      primaryProvider = 'openai'
      fallbackProvider = providers.find(p => p !== 'openai')
    } else {
      // Auto-select: prefer Anthropic for comprehensive, OpenAI for focused
      if (promptType === 'comprehensive' && providers.includes('anthropic')) {
        primaryProvider = 'anthropic'
        fallbackProvider = providers.find(p => p !== 'anthropic')
      } else if (providers.includes('openai')) {
        primaryProvider = 'openai'
        fallbackProvider = providers.find(p => p !== 'openai')
      } else {
        primaryProvider = providers[0]
        fallbackProvider = providers[1]
      }
    }

    // Try primary provider
    try {
      if (primaryProvider === 'anthropic') {
        const result = await this.anthropicClient.generatePrompt(userIdea, promptType, focusArea)
        return { ...result, source: 'anthropic-claude' }
      } else if (primaryProvider === 'openai') {
        const result = await this.openaiClient.generatePrompt(userIdea, promptType, focusArea)
        return { ...result, source: 'openai-gpt4' }
      }
    } catch (error) {
      console.warn(`Primary provider (${primaryProvider}) failed:`, error.message)
      
      // Check if this is a CORS/network error that affects all providers
      if (error.message.includes('CORS restrictions') || error.message.includes('Failed to fetch')) {
        console.warn('CORS/Network error detected, skipping fallback provider and using template fallback')
        return null
      }
      
      // Try fallback provider if available and error is not network-related
      if (fallbackProvider) {
        try {
          if (fallbackProvider === 'anthropic') {
            const result = await this.anthropicClient.generatePrompt(userIdea, promptType, focusArea)
            return { ...result, source: 'anthropic-claude' }
          } else if (fallbackProvider === 'openai') {
            const result = await this.openaiClient.generatePrompt(userIdea, promptType, focusArea)
            return { ...result, source: 'openai-gpt4' }
          }
        } catch (fallbackError) {
          console.warn(`Fallback provider (${fallbackProvider}) also failed:`, fallbackError.message)
        }
      }
    }

    return null
  }

  // Get list of available providers based on API keys
  getAvailableProviders() {
    const providers = []
    
    if (this.anthropicClient.apiKey) {
      providers.push('anthropic')
    }
    
    if (this.openaiClient.apiKey) {
      providers.push('openai')
    }
    
    return providers
  }

  // Fallback method using templates (original demo logic)
  generateFallbackPrompt(userIdea, promptType, focusArea) {
    const analysis = this.analyzeUserInput(userIdea)
    
    return {
      ...this.anthropicClient.generateFallbackPrompt(userIdea, promptType, focusArea),
      analysis,
      isRealAI: false,
      source: 'template-fallback'
    }
  }

  // Analyze user input to determine domain and requirements
  analyzeUserInput(userIdea) {
    const keywords = userIdea.toLowerCase()
    const analysis = {
      domains: [],
      complexity: 'medium',
      technologies: [],
      requirements: []
    }

    // Domain detection
    const domainKeywords = {
      'web-development': ['website', 'web', 'frontend', 'react', 'vue', 'angular', 'html', 'css', 'javascript'],
      'mobile-development': ['mobile', 'app', 'ios', 'android', 'react native', 'flutter', 'ionic'],
      'backend-development': ['api', 'backend', 'server', 'database', 'node.js', 'python', 'django', 'fastapi'],
      'data-science': ['data', 'analysis', 'ml', 'ai', 'machine learning', 'pandas', 'numpy', 'tensorflow'],
      'devops': ['deploy', 'cloud', 'infrastructure', 'docker', 'kubernetes', 'aws', 'ci/cd']
    }

    Object.entries(domainKeywords).forEach(([domain, domainWords]) => {
      if (domainWords.some(word => keywords.includes(word))) {
        analysis.domains.push(domain)
      }
    })

    // Complexity assessment
    const complexityIndicators = ['complex', 'advanced', 'enterprise', 'scalable', 'distributed', 'microservices']
    const simpleIndicators = ['simple', 'basic', 'quick', 'prototype', 'minimal']
    
    if (complexityIndicators.some(indicator => keywords.includes(indicator))) {
      analysis.complexity = 'high'
    } else if (simpleIndicators.some(indicator => keywords.includes(indicator))) {
      analysis.complexity = 'low'
    }

    // Technology detection
    const technologies = [
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby',
      'node.js', 'express', 'fastapi', 'django', 'flask', 'spring',
      'typescript', 'javascript', 'python', 'java', 'go', 'rust',
      'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'vercel', 'netlify'
    ]
    
    analysis.technologies = technologies.filter(tech => 
      keywords.includes(tech.toLowerCase())
    )

    return analysis
  }

  // Check if real AI is available
  isRealAIAvailable() {
    return this.isOnline && this.getAvailableProviders().length > 0
  }

  // Get API status with enhanced error information
  getAPIStatus() {
    const providers = this.getAvailableProviders()
    
    return {
      online: this.isOnline,
      hasAnthropicKey: !!this.anthropicClient.apiKey,
      hasOpenAIKey: !!this.openaiClient.apiKey,
      availableProviders: providers,
      canUseRealAI: this.isRealAIAvailable(),
      preferredProvider: providers.includes('anthropic') ? 'anthropic' : providers[0] || null,
      corsWarning: providers.length > 0 ? 'Direct API calls may be blocked by CORS. Consider using a backend proxy for production.' : null
    }
  }
}

export default PromptGenerator