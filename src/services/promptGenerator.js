// AI Prompt Generator Service
// Combines multiple AI system prompts to create comprehensive prompts for user ideas

class PromptGenerator {
  constructor() {
    this.promptTemplates = {
      // Core system identity and capabilities
      identity: {
        template: `You are an advanced AI assistant with expertise across multiple domains. You combine the capabilities of leading AI systems to provide comprehensive, accurate, and helpful responses.`,
        weight: 1.0
      },

      // Communication and interaction patterns
      communication: {
        template: `## Communication Guidelines
- Be conversational but professional
- Adapt your tone to match the user's needs
- Use clear, concise language
- Format responses with proper markdown
- Provide step-by-step explanations when needed
- Ask clarifying questions when requirements are unclear`,
        weight: 0.8
      },

      // Tool usage and capabilities
      toolUsage: {
        template: `## Tool Usage and Capabilities
- You have access to various tools for code editing, file operations, and system interactions
- Always explain what you're doing before using tools
- Use tools efficiently and only when necessary
- Combine multiple operations when possible
- Validate results after making changes`,
        weight: 0.9
      },

      // Code development best practices
      codeDevelopment: {
        template: `## Code Development Guidelines
- Write clean, maintainable, and well-documented code
- Follow language-specific best practices and conventions
- Implement proper error handling and validation
- Use appropriate design patterns and architectural principles
- Ensure code is production-ready and immediately runnable
- Add necessary dependencies and imports
- Create modular, reusable components`,
        weight: 1.0
      },

      // Problem-solving approach
      problemSolving: {
        template: `## Problem-Solving Approach
- Break down complex problems into manageable steps
- Analyze requirements thoroughly before implementation
- Consider edge cases and potential issues
- Provide multiple solutions when appropriate
- Explain your reasoning and decision-making process
- Test and validate solutions before presenting them`,
        weight: 0.9
      },

      // Web development specifics
      webDevelopment: {
        template: `## Web Development Excellence
- Create responsive, accessible designs
- Implement modern UI/UX best practices
- Use semantic HTML and proper CSS organization
- Ensure cross-browser compatibility
- Optimize for performance and user experience
- Follow security best practices
- Implement proper state management`,
        weight: 0.8
      },

      // AI and automation
      aiAutomation: {
        template: `## AI and Automation Capabilities
- Leverage AI tools and APIs effectively
- Implement intelligent automation workflows
- Use machine learning concepts appropriately
- Integrate with external AI services
- Handle data processing and analysis
- Implement natural language processing features`,
        weight: 0.7
      },

      // Safety and ethics
      safetyEthics: {
        template: `## Safety and Ethics
- Prioritize user safety and data protection
- Follow ethical AI principles
- Respect privacy and confidentiality
- Avoid harmful or inappropriate content
- Implement proper security measures
- Be transparent about limitations`,
        weight: 1.0
      }
    }

    this.domainSpecificPrompts = {
      'web-development': {
        frameworks: ['React', 'Vue', 'Angular', 'Next.js', 'Svelte'],
        tools: ['Vite', 'Webpack', 'Tailwind CSS', 'TypeScript'],
        focus: 'responsive design, performance optimization, accessibility'
      },
      'mobile-development': {
        frameworks: ['React Native', 'Flutter', 'Ionic'],
        tools: ['Expo', 'Android Studio', 'Xcode'],
        focus: 'cross-platform compatibility, native performance, user experience'
      },
      'backend-development': {
        frameworks: ['Node.js', 'Express', 'FastAPI', 'Django'],
        tools: ['Docker', 'PostgreSQL', 'Redis', 'MongoDB'],
        focus: 'scalability, security, API design, database optimization'
      },
      'data-science': {
        frameworks: ['Python', 'Pandas', 'NumPy', 'TensorFlow'],
        tools: ['Jupyter', 'Matplotlib', 'Scikit-learn'],
        focus: 'data analysis, machine learning, visualization, statistical modeling'
      },
      'devops': {
        frameworks: ['Kubernetes', 'Docker', 'Terraform'],
        tools: ['AWS', 'GitHub Actions', 'Jenkins'],
        focus: 'automation, deployment, monitoring, infrastructure as code'
      }
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
    if (keywords.includes('website') || keywords.includes('web') || keywords.includes('frontend')) {
      analysis.domains.push('web-development')
    }
    if (keywords.includes('mobile') || keywords.includes('app') || keywords.includes('ios') || keywords.includes('android')) {
      analysis.domains.push('mobile-development')
    }
    if (keywords.includes('api') || keywords.includes('backend') || keywords.includes('server') || keywords.includes('database')) {
      analysis.domains.push('backend-development')
    }
    if (keywords.includes('data') || keywords.includes('analysis') || keywords.includes('ml') || keywords.includes('ai')) {
      analysis.domains.push('data-science')
    }
    if (keywords.includes('deploy') || keywords.includes('cloud') || keywords.includes('infrastructure')) {
      analysis.domains.push('devops')
    }

    // Complexity assessment
    const complexityIndicators = ['complex', 'advanced', 'enterprise', 'scalable', 'distributed']
    const simpleIndicators = ['simple', 'basic', 'quick', 'prototype']
    
    if (complexityIndicators.some(indicator => keywords.includes(indicator))) {
      analysis.complexity = 'high'
    } else if (simpleIndicators.some(indicator => keywords.includes(indicator))) {
      analysis.complexity = 'low'
    }

    // Technology detection
    const allTechnologies = Object.values(this.domainSpecificPrompts)
      .flatMap(domain => [...domain.frameworks, ...domain.tools])
    
    analysis.technologies = allTechnologies.filter(tech => 
      keywords.includes(tech.toLowerCase())
    )

    return analysis
  }

  // Generate domain-specific sections
  generateDomainSections(domains) {
    return domains.map(domain => {
      const domainInfo = this.domainSpecificPrompts[domain]
      if (!domainInfo) return ''

      return `## ${domain.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Expertise

**Recommended Technologies:**
- Frameworks: ${domainInfo.frameworks.join(', ')}
- Tools: ${domainInfo.tools.join(', ')}

**Focus Areas:** ${domainInfo.focus}

**Best Practices:**
- Follow industry standards and conventions
- Implement proper testing strategies
- Ensure code quality and maintainability
- Consider performance and scalability
- Document your implementation decisions`
    }).join('\n\n')
  }

  // Generate complexity-specific guidelines
  generateComplexityGuidelines(complexity) {
    const guidelines = {
      low: `## Project Approach (Simple/Prototype)
- Focus on rapid development and core functionality
- Use proven, simple solutions
- Minimize dependencies and complexity
- Prioritize working implementation over optimization
- Document key decisions for future enhancement`,

      medium: `## Project Approach (Standard)
- Balance development speed with code quality
- Implement proper architecture and design patterns
- Include comprehensive error handling
- Add appropriate testing coverage
- Plan for future scalability and maintenance`,

      high: `## Project Approach (Complex/Enterprise)
- Design for scalability, maintainability, and performance
- Implement comprehensive testing strategies
- Use advanced architectural patterns
- Include monitoring, logging, and observability
- Plan for deployment, security, and compliance
- Document architecture decisions and trade-offs`
    }

    return guidelines[complexity] || guidelines.medium
  }

  // Generate technology-specific instructions
  generateTechnologyInstructions(technologies) {
    if (technologies.length === 0) return ''

    return `## Technology-Specific Guidelines

**Selected Technologies:** ${technologies.join(', ')}

**Implementation Notes:**
- Use the latest stable versions of selected technologies
- Follow official documentation and best practices
- Implement proper configuration and setup
- Consider integration patterns between technologies
- Ensure compatibility and version alignment`
  }

  // Generate the complete comprehensive prompt
  generateComprehensivePrompt(userIdea) {
    const analysis = this.analyzeUserInput(userIdea)
    
    let prompt = `# Comprehensive AI Assistant Prompt for: "${userIdea}"

${this.promptTemplates.identity.template}

${this.promptTemplates.communication.template}

${this.promptTemplates.toolUsage.template}

${this.promptTemplates.codeDevelopment.template}

${this.promptTemplates.problemSolving.template}`

    // Add domain-specific sections
    if (analysis.domains.length > 0) {
      prompt += '\n\n' + this.generateDomainSections(analysis.domains)
    }

    // Add web development section if relevant
    if (analysis.domains.includes('web-development')) {
      prompt += '\n\n' + this.promptTemplates.webDevelopment.template
    }

    // Add AI automation section if relevant
    if (analysis.domains.includes('data-science') || userIdea.toLowerCase().includes('ai')) {
      prompt += '\n\n' + this.promptTemplates.aiAutomation.template
    }

    // Add complexity guidelines
    prompt += '\n\n' + this.generateComplexityGuidelines(analysis.complexity)

    // Add technology instructions
    if (analysis.technologies.length > 0) {
      prompt += '\n\n' + this.generateTechnologyInstructions(analysis.technologies)
    }

    // Add safety and ethics
    prompt += '\n\n' + this.promptTemplates.safetyEthics.template

    // Add task-specific instructions
    prompt += `

## Task-Specific Instructions

**User Request:** ${userIdea}

**Your Mission:**
1. Analyze the user's request thoroughly
2. Break down the task into clear, actionable steps
3. Implement the solution using best practices
4. Provide clear explanations of your approach
5. Test and validate your implementation
6. Offer suggestions for improvements or extensions

**Success Criteria:**
- Solution directly addresses the user's needs
- Code is clean, well-documented, and production-ready
- Implementation follows industry best practices
- User receives clear guidance and explanations
- Solution is scalable and maintainable

**Remember:** You are combining the expertise of multiple AI systems to provide the most comprehensive and helpful response possible. Draw from the strengths of coding assistants, design experts, and technical advisors to deliver exceptional results.`

    return {
      prompt,
      analysis,
      metadata: {
        generatedAt: new Date().toISOString(),
        domains: analysis.domains,
        complexity: analysis.complexity,
        technologies: analysis.technologies,
        promptLength: prompt.length,
        estimatedTokens: Math.ceil(prompt.length / 4) // Rough token estimate
      }
    }
  }

  // Generate a shorter, focused prompt for specific use cases
  generateFocusedPrompt(userIdea, focusArea = 'general') {
    const analysis = this.analyzeUserInput(userIdea)
    
    const focusedTemplates = {
      coding: `You are an expert software developer. ${this.promptTemplates.codeDevelopment.template}`,
      design: `You are a UI/UX design expert. Focus on creating beautiful, user-friendly interfaces with modern design principles.`,
      architecture: `You are a software architect. Focus on system design, scalability, and technical decision-making.`,
      debugging: `You are a debugging expert. Focus on identifying issues, analyzing problems, and providing solutions.`,
      general: this.promptTemplates.identity.template
    }

    let prompt = focusedTemplates[focusArea] || focusedTemplates.general

    if (analysis.domains.length > 0) {
      prompt += '\n\n' + this.generateDomainSections(analysis.domains.slice(0, 2)) // Limit to 2 domains for focused prompt
    }

    prompt += `\n\n## Task: ${userIdea}

Provide a focused, actionable response that directly addresses this request. Be concise but comprehensive in your approach.`

    return {
      prompt,
      analysis,
      metadata: {
        generatedAt: new Date().toISOString(),
        focusArea,
        promptLength: prompt.length,
        estimatedTokens: Math.ceil(prompt.length / 4)
      }
    }
  }
}

export default PromptGenerator