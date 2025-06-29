// Anthropic API Client for real AI prompt generation

class AnthropicClient {
  constructor() {
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
    this.baseUrl = 'https://api.anthropic.com/v1/messages'
  }

  async generatePrompt(userIdea, promptType = 'comprehensive', focusArea = 'general') {
    if (!this.apiKey) {
      throw new Error('Anthropic API key not found. Please check your environment variables.')
    }

    const systemPrompt = this.buildSystemPrompt(promptType, focusArea)
    const userPrompt = this.buildUserPrompt(userIdea, promptType, focusArea)

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 4000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt
            }
          ]
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()
      
      if (!data.content || !data.content[0] || !data.content[0].text) {
        throw new Error('Invalid response format from Anthropic API')
      }

      return {
        prompt: data.content[0].text,
        metadata: {
          generatedAt: new Date().toISOString(),
          model: 'claude-3-sonnet',
          promptType,
          focusArea,
          promptLength: data.content[0].text.length,
          estimatedTokens: data.usage?.output_tokens || Math.ceil(data.content[0].text.length / 4),
          inputTokens: data.usage?.input_tokens || 0,
          outputTokens: data.usage?.output_tokens || 0
        }
      }
    } catch (error) {
      console.error('Anthropic API Error:', error)
      
      // Handle specific CORS/network errors
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('Unable to connect to Anthropic API. This is likely due to CORS restrictions when calling external APIs directly from the browser. Consider using a backend proxy server for production use.')
      }
      
      throw new Error(`Failed to generate prompt: ${error.message}`)
    }
  }

  buildSystemPrompt(promptType, focusArea) {
    const baseSystem = `You are an expert AI prompt engineer with deep knowledge of all major AI systems including GPT-4, Claude, Gemini, and specialized coding assistants like Cursor, v0, Windsurf, Bolt, and others.

Your task is to create highly effective system prompts that combine the best practices from multiple AI systems. You have access to the actual system prompts from leading AI tools and should draw from their strengths.

Key principles:
- Create prompts that are clear, specific, and actionable
- Include proper role definition and capabilities
- Add relevant guidelines for tool usage and code generation
- Incorporate safety and ethical considerations
- Tailor the prompt to the specific use case and domain
- Make the prompt production-ready and immediately usable`

    if (promptType === 'focused') {
      const focusInstructions = {
        general: 'Focus on creating a versatile general-purpose assistant prompt.',
        coding: 'Focus on creating a specialized coding assistant prompt with emphasis on code quality, best practices, and development workflows.',
        design: 'Focus on creating a UI/UX design expert prompt with emphasis on user experience, visual design, and accessibility.',
        architecture: 'Focus on creating a software architecture expert prompt with emphasis on system design, scalability, and technical decision-making.',
        debugging: 'Focus on creating a debugging specialist prompt with emphasis on problem diagnosis, error analysis, and solution finding.'
      }
      
      return `${baseSystem}\n\n${focusInstructions[focusArea] || focusInstructions.general}`
    }

    return `${baseSystem}\n\nCreate a comprehensive prompt that combines multiple AI capabilities and can handle diverse tasks effectively.`
  }

  buildUserPrompt(userIdea, promptType, focusArea) {
    const analysisPrompt = `Analyze this user request and create a ${promptType} AI system prompt for it:

"${userIdea}"

Requirements:
1. Create a complete, ready-to-use system prompt
2. Include role definition and core capabilities
3. Add specific guidelines relevant to the task
4. Include tool usage instructions if applicable
5. Add safety and ethical guidelines
6. Make it production-ready and immediately usable

${promptType === 'comprehensive' ? 
  'Create a detailed, comprehensive prompt that covers all aspects and can handle complex scenarios.' :
  `Create a focused prompt optimized for ${focusArea} tasks.`
}

The output should be a complete system prompt that can be directly used with any AI assistant. Do not include explanations or meta-commentary - just return the actual system prompt content.`

    return analysisPrompt
  }

  // Check if API is accessible (basic connectivity test)
  async testConnection() {
    if (!this.apiKey) {
      return { success: false, error: 'No API key configured' }
    }

    try {
      // Simple test request with minimal tokens
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 10,
          messages: [{ role: 'user', content: 'Hi' }]
        })
      })

      return { success: response.ok, status: response.status }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Fallback method for when API is unavailable
  generateFallbackPrompt(userIdea, promptType, focusArea) {
    const templates = {
      comprehensive: `# Comprehensive AI Assistant System Prompt

You are an advanced AI assistant with expertise across multiple domains. You excel at understanding complex requirements and providing detailed, actionable solutions.

## Core Capabilities
- Advanced reasoning and problem-solving
- Code development and debugging
- Technical writing and documentation
- Project planning and architecture
- Creative problem-solving

## Task: ${userIdea}

## Guidelines
- Analyze requirements thoroughly before responding
- Provide step-by-step solutions when appropriate
- Use best practices and industry standards
- Ensure all code is production-ready
- Include proper error handling and validation
- Document your approach and decisions

## Communication Style
- Be clear, concise, and professional
- Use proper formatting and structure
- Provide examples when helpful
- Ask clarifying questions when needed

## Safety and Ethics
- Prioritize user safety and data protection
- Follow ethical AI principles
- Respect privacy and confidentiality
- Avoid harmful or inappropriate content`,

      focused: {
        general: `You are a helpful AI assistant focused on providing clear, accurate, and actionable responses.

Task: ${userIdea}

Provide a focused solution that directly addresses this request.`,
        
        coding: `You are an expert software developer with deep knowledge of programming languages, frameworks, and best practices.

Task: ${userIdea}

Focus on:
- Writing clean, maintainable code
- Following best practices and conventions
- Implementing proper error handling
- Ensuring code is production-ready
- Providing clear explanations of your approach`,

        design: `You are a UI/UX design expert specializing in creating beautiful, user-friendly interfaces.

Task: ${userIdea}

Focus on:
- Modern design principles
- User experience optimization
- Accessibility best practices
- Responsive design
- Visual hierarchy and aesthetics`,

        architecture: `You are a software architect with expertise in system design and technical decision-making.

Task: ${userIdea}

Focus on:
- Scalable system design
- Technology selection and trade-offs
- Performance and reliability
- Security considerations
- Maintainability and extensibility`,

        debugging: `You are a debugging expert specializing in identifying and solving technical problems.

Task: ${userIdea}

Focus on:
- Systematic problem diagnosis
- Root cause analysis
- Step-by-step troubleshooting
- Clear explanation of issues and solutions
- Prevention strategies`
      }
    }

    const prompt = promptType === 'comprehensive' ? 
      templates.comprehensive : 
      templates.focused[focusArea] || templates.focused.general

    return {
      prompt,
      metadata: {
        generatedAt: new Date().toISOString(),
        model: 'fallback-template',
        promptType,
        focusArea,
        promptLength: prompt.length,
        estimatedTokens: Math.ceil(prompt.length / 4),
        inputTokens: 0,
        outputTokens: 0
      }
    }
  }
}

export default AnthropicClient