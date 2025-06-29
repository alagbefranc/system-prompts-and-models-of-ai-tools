import React, { createContext, useContext } from 'react'

const AIToolsContext = createContext()

export const useAITools = () => {
  const context = useContext(AIToolsContext)
  if (!context) {
    throw new Error('useAITools must be used within an AIToolsProvider')
  }
  return context
}

export const AIToolsProvider = ({ children }) => {
  const aiTools = [
    {
      id: 'v0',
      name: 'v0',
      company: 'Vercel',
      description: 'AI-powered assistant for web development with React and Next.js',
      category: 'Web Development',
      features: ['React Components', 'Next.js Apps', 'MDX Support', 'Code Projects'],
      hasPrompt: true,
      hasTools: true,
      color: 'from-black to-gray-800',
      icon: '⚡'
    },
    {
      id: 'cursor',
      name: 'Cursor',
      company: 'Cursor',
      description: 'AI-powered code editor with advanced coding assistance',
      category: 'Code Editor',
      features: ['Code Completion', 'Chat Interface', 'File Editing', 'Terminal Integration'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-blue-500 to-purple-600',
      icon: '🎯'
    },
    {
      id: 'windsurf',
      name: 'Windsurf Agent',
      company: 'Codeium',
      description: 'Revolutionary agentic AI coding assistant with AI Flow paradigm',
      category: 'AI Agent',
      features: ['Autonomous Coding', 'Memory System', 'Browser Preview', 'Web Deployment'],
      hasPrompt: true,
      hasTools: true,
      color: 'from-cyan-400 to-blue-500',
      icon: '🌊'
    },
    {
      id: 'bolt',
      name: 'Bolt',
      company: 'StackBlitz',
      description: 'Expert AI assistant for web development with WebContainer technology',
      category: 'Web Development',
      features: ['WebContainer', 'Real-time Preview', 'Package Management', 'Database Integration'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-orange-400 to-red-500',
      icon: '⚡'
    },
    {
      id: 'cline',
      name: 'Cline',
      company: 'Open Source',
      description: 'Highly skilled software engineer with extensive programming knowledge',
      category: 'Code Assistant',
      features: ['File Operations', 'Terminal Commands', 'Browser Automation', 'MCP Integration'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-green-400 to-emerald-600',
      icon: '🔧'
    },
    {
      id: 'devin',
      name: 'Devin AI',
      company: 'Cognition',
      description: 'Software engineer using real computer operating system',
      category: 'AI Engineer',
      features: ['System Operations', 'Git Integration', 'Browser Actions', 'File Management'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-purple-500 to-pink-600',
      icon: '🤖'
    },
    {
      id: 'replit',
      name: 'Replit Agent',
      company: 'Replit',
      description: 'Expert autonomous programmer for building software on Replit',
      category: 'Cloud IDE',
      features: ['Workflow Management', 'Database Integration', 'Deployment', 'Package Management'],
      hasPrompt: true,
      hasTools: true,
      color: 'from-indigo-500 to-purple-600',
      icon: '🔄'
    },
    {
      id: 'same-dev',
      name: 'Same.dev',
      company: 'Same',
      description: 'Powerful AI coding assistant in cloud-based IDE',
      category: 'Cloud IDE',
      features: ['Web Scraping', 'UI Cloning', 'Version Control', 'Deployment'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-teal-400 to-cyan-600',
      icon: '🎨'
    },
    {
      id: 'lovable',
      name: 'Lovable',
      company: 'Lovable',
      description: 'AI-powered full-stack development platform',
      category: 'Full-Stack',
      features: ['Full-Stack Apps', 'Database Management', 'API Integration', 'Deployment'],
      hasPrompt: false,
      hasTools: false,
      color: 'from-pink-400 to-rose-600',
      icon: '💖'
    },
    {
      id: 'manus',
      name: 'Manus',
      company: 'Manus Team',
      description: 'AI assistant for information gathering and content creation',
      category: 'Research Assistant',
      features: ['Information Gathering', 'Data Analysis', 'Content Creation', 'Web Research'],
      hasPrompt: true,
      hasTools: true,
      color: 'from-amber-400 to-orange-600',
      icon: '📚'
    },
    {
      id: 'vscode-agent',
      name: 'VSCode Agent',
      company: 'GitHub/Microsoft',
      description: 'GitHub Copilot AI programming assistant for VSCode',
      category: 'Code Assistant',
      features: ['Code Completion', 'Error Detection', 'File Operations', 'Terminal Integration'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-blue-600 to-indigo-700',
      icon: '💻'
    },
    {
      id: 'dia',
      name: 'Dia Browser',
      company: 'The Browser Company',
      description: 'AI chat product working inside the Dia web browser',
      category: 'Browser AI',
      features: ['Web Search', 'Content Analysis', 'Simple Answers', 'Image Display'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-violet-500 to-purple-700',
      icon: '🌐'
    },
    {
      id: 'trae',
      name: 'Trae AI',
      company: 'Trae',
      description: 'Powerful agentic AI coding assistant with AI Flow paradigm',
      category: 'AI Agent',
      features: ['Code Analysis', 'File Operations', 'Terminal Commands', 'Web Citations'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-emerald-500 to-teal-600',
      icon: '🚀'
    },
    {
      id: 'cluely',
      name: 'Cluely',
      company: 'Cluely',
      description: 'Assistant for analyzing and solving problems with screen analysis',
      category: 'Problem Solver',
      features: ['Problem Analysis', 'Screen Analysis', 'Technical Solutions', 'Math Rendering'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-red-500 to-pink-600',
      icon: '🔍'
    },
    {
      id: 'spawn',
      name: 'Spawn',
      company: 'Spawn',
      description: 'Game creation powerhouse with advanced security architecture',
      category: 'Game Development',
      features: ['Game Creation', 'Multiplayer Support', 'Monetization', 'Security'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-purple-600 to-indigo-700',
      icon: '🎮'
    },
    {
      id: 'junie',
      name: 'Junie',
      company: 'Open Source',
      description: 'Helpful assistant for exploring and clarifying user ideas',
      category: 'Research Assistant',
      features: ['Project Exploration', 'Code Retrieval', 'File Analysis', 'Search Tools'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-yellow-400 to-amber-600',
      icon: '🔎'
    },
    {
      id: 'roocode',
      name: 'RooCode',
      company: 'Roo',
      description: 'Highly skilled software engineer with focus on maintainability',
      category: 'Code Assistant',
      features: ['Code Editing', 'File Operations', 'Error Detection', 'MCP Integration'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-slate-600 to-gray-700',
      icon: '🦘'
    },
    {
      id: 'codex-cli',
      name: 'Codex CLI',
      company: 'OpenAI',
      description: 'Terminal-based agentic coding assistant built by OpenAI',
      category: 'CLI Tool',
      features: ['Terminal Interface', 'Code Patches', 'Git Integration', 'Sandboxed Environment'],
      hasPrompt: true,
      hasTools: false,
      color: 'from-gray-700 to-slate-800',
      icon: '⌨️'
    }
  ]

  return (
    <AIToolsContext.Provider value={{ aiTools }}>
      {children}
    </AIToolsContext.Provider>
  )
}