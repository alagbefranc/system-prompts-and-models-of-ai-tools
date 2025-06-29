// AI Prompt Generator Service with Real AI Integration
import AnthropicClient from './anthropicClient'

class PromptGenerator {
  constructor() {
    this.anthropicClient = new AnthropicClient()
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
  async generateComprehensivePrompt(userIdea) {
    try {
      // Try to use real AI first
      if (this.isOnline && this.anthropicClient.apiKey) {
        const result = await this.anthropicClient.generatePrompt(userIdea, 'comprehensive', 'general')
        
        // Add analysis metadata
        const analysis = this.analyzeUserInput(userIdea)
        
        return {
          ...result,
          analysis,
          isRealAI: true,
          source: 'anthropic-claude'
        }
      } else {
        // Fallback to template-based generation
        console.warn('Using fallback prompt generation (API unavailable or offline)')
        return this.generateFallbackPrompt(userIdea, 'comprehensive', 'general')
      }
    } catch (error) {
      console.error('Error generating comprehensive prompt:', error)
      // Fallback on error
      return this.generateFallbackPrompt(userIdea, 'comprehensive', 'general')
    }
  }

  // Generate focused prompts using real AI
  async generateFocusedPrompt(userIdea, focusArea = 'general') {
    try {
      // Try to use real AI first
      if (this.isOnline && this.anthropicClient.apiKey) {
        const result = await this.anthropicClient.generatePrompt(userIdea, 'focused', focusArea)
        
        // Add analysis metadata
        const analysis = this.analyzeUserInput(userIdea)
        
        return {
          ...result,
          analysis,
          isRealAI: true,
          source: 'anthropic-claude'
        }
      } else {
        // Fallback to template-based generation
        console.warn('Using fallback prompt generation (API unavailable or offline)')
        return this.generateFallbackPrompt(userIdea, 'focused', focusArea)
      }
    } catch (error) {
      console.error('Error generating focused prompt:', error)
      // Fallback on error
      return this.generateFallbackPrompt(userIdea, 'focused', focusArea)
    }
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
    return this.isOnline && this.anthropicClient.apiKey
  }

  // Get API status
  getAPIStatus() {
    return {
      online: this.isOnline,
      hasApiKey: !!this.anthropicClient.apiKey,
      canUseRealAI: this.isRealAIAvailable()
    }
  }
}

export default PromptGenerator