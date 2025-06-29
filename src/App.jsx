import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import ToolDetail from './pages/ToolDetail'
import PromptDetail from './pages/PromptDetail'
import { AIToolsProvider } from './context/AIToolsContext'

function App() {
  return (
    <AIToolsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tool/:toolName" element={<ToolDetail />} />
          <Route path="/prompt/:toolName" element={<PromptDetail />} />
        </Routes>
      </Layout>
    </AIToolsProvider>
  )
}

export default App