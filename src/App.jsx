import React from 'react'
import Navbar from './components/Navbar'
import ChatFace from './components/ChatFace'
import Footer from './components/Footer'

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Navbar />
      <main className="max-w-5xl mx-auto flex flex-col items-center justify-center py-18 px-4">
        <ChatFace />
      </main>
    </div>
  )
}

export default App
