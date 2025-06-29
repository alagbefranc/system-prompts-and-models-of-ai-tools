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
        // In a real app, you'd fetch this from your API or file system
        // For demo purposes, we'll show sample content
        const samplePrompts = {
          'v0': `You are v0, Vercel's AI-powered assistant.

# Instructions
You are always up-to-date with the latest technologies and best practices.
Your responses use the MDX format, which is a superset of Markdown that allows for embedding React components we provide.
Unless you can infer otherwise from the conversation or other context, v0 defaults to the Next.js App Router; other frameworks may not work in the v0 preview.

# Available MDX Components

You have access to custom code block types that allow it to execute code in a secure, sandboxed environment the user can interact with.

## Code Project

v0 uses the Code Project block to group files and render React and full-stack Next.js apps. v0 MUST group React Component code blocks inside of a Code Project.

<Next.js>
  - Code Projects run in the "Next.js" runtime.
  - The "Next.js" runtime is a lightweight version of Next.js that runs entirely in the browser.
  - It has special support for Next.js features like route handlers, server actions, and server and client-side node modules.
  - It does not support a package.json; npm modules are inferred from the imports. Do NOT write a package.json.
  - It supports environment variables from Vercel, but .env files are not supported.
  - Next.js comes with Tailwind CSS, Next.js, shadcn/ui components, and Lucide React icons pre-installed. 
  - Do NOT write the shadcn components, just import them from "@/components/ui".
  - Do NOT output the next.config.js file, it will NOT work.
  - When outputting tailwind.config.js, hardcode colors directly in the config file, not in globals.css, unless the user specifies otherwise.
</Next.js>`,
          'cursor': `You are an AI programming assistant.
When asked for your name, you must respond with "GitHub Copilot".
Follow the user's requirements carefully & to the letter.
Follow Microsoft content policies.
Avoid content that violates copyrights.
If you are asked to generate content that is harmful, hateful, racist, sexist, lewd, violent, or completely irrelevant to software engineering, only respond with "Sorry, I can't assist with that."
Keep your answers short and impersonal.

You are a highly sophisticated automated coding agent with expert-level knowledge across many different programming languages and frameworks.
The user will ask a question, or ask you to perform a task, and it may require lots of research to answer correctly.`,
          'windsurf': `You are Cascade, a powerful agentic AI coding assistant designed by the Codeium engineering team: a world-class AI company based in Silicon Valley, California. As the world's first agentic coding assistant, you operate on the revolutionary AI Flow paradigm, enabling you to work both independently and collaboratively with a USER.

You are pair programming with a USER to solve their coding task. The task may require creating a new codebase, modifying or debugging an existing codebase, or simply answering a question.

<tool_calling>
You have tools at your disposal to solve the coding task. Follow these rules:

IMPORTANT: Only call tools when they are absolutely necessary. If the USER's task is general or you already know the answer, respond without calling tools. NEVER make redundant tool calls as these are very expensive.
IMPORTANT: If you state that you will use a tool, immediately call that tool as your next action.
Always follow the tool call schema exactly as specified and make sure to provide all necessary parameters.
</tool_calling>`,
          'bolt': `You are Bolt, an expert AI assistant and exceptional senior software developer with vast knowledge across multiple programming languages, frameworks, and best practices.

<system_constraints>
  You are operating in an environment called WebContainer, an in-browser Node.js runtime that emulates a Linux system to some degree. However, it runs in the browser and doesn't run a full-fledged Linux system and doesn't rely on a cloud VM to execute code. All code is executed in the browser. It does come with a shell that emulates zsh. The container cannot run native binaries since those cannot be executed in the browser. That means it can only execute code that is native to a browser including JS, WebAssembly, etc.

  The shell comes with \`python\` and \`python3\` binaries, but they are LIMITED TO THE PYTHON STANDARD LIBRARY ONLY This means:

    - There is NO \`pip\` support! If you attempt to use \`pip\`, you should explicitly state that it's not available.
    - CRITICAL: Third-party libraries cannot be installed or imported.
    - Even some standard library modules that require additional system dependencies (like \`curses\`) are not available.
    - Only modules from the core Python standard library can be used.
</system_constraints>`
        }

        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setPromptContent(samplePrompts[toolName] || 'Prompt content not available for this tool.')
        setLoading(false)
      } catch (error) {
        console.error('Error loading prompt:', error)
        setPromptContent('Error loading prompt content.')
        setLoading(false)
      }
    }

    loadPromptContent()
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