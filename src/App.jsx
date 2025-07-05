import React from 'react'
import Navbar from './components/Navbar'
import ChatFace from './components/ChatFace'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto flex flex-col items-center justify-center py-16 px-4">
        <ChatFace />
      </main>
      {/* Simple Footer */}
      <footer className="py-6 text-center text-gray-400 text-sm">
        <p>© {new Date().getFullYear()} NeethOs AI. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App