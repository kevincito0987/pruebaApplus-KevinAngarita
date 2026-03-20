import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans p-8 selection:bg-cyan-500/30">
      {/* Sección Principal (Hero) */}
      <section className="max-w-4xl mx-auto flex flex-col items-center text-center py-16">
        <div className="relative mb-8 group">
          <img src={heroImg} className="w-40 h-auto drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]" alt="Hero" />
          <img src={reactLogo} className="absolute -bottom-2 -right-2 w-12 animate-[spin_10s_linear_infinite]" alt="React logo" />
          <img src={viteLogo} className="absolute -top-2 -left-2 w-10" alt="Vite logo" />
        </div>

        <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
          Get started
        </h1>
        
        <p className="text-slate-400 text-lg mb-8">
          Edit <code className="bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">src/App.tsx</code> and save to test <code className="text-blue-400 font-bold">HMR</code>
        </p>

        <button
          className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 active:scale-95 transition-all rounded-full font-bold shadow-lg shadow-cyan-900/20 cursor-pointer"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      {/* Separador */}
      <div className="max-w-5xl mx-auto h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12"></div>

      {/* Sección de Pasos Siguientes */}
      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* Documentación */}
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-cyan-500/50 transition-colors group">
          <div className="flex items-center gap-4 mb-4 text-cyan-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Documentation</h2>
          </div>
          <p className="text-slate-400 mb-6">Your questions, answered</p>
          <ul className="space-y-3">
            <li>
              <a href="https://vite.dev/" target="_blank" className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium">
                <img className="w-5 h-5" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium">
                <img className="w-5 h-5" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>

        {/* Redes Sociales */}
        <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors group">
          <div className="flex items-center gap-4 mb-4 text-blue-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-white">Connect with us</h2>
          </div>
          <p className="text-slate-400 mb-6">Join the Vite community</p>
          <div className="grid grid-cols-2 gap-3">
            <a href="https://github.com/vitejs/vite" target="_blank" className="flex justify-center items-center gap-2 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium">
              GitHub
            </a>
            <a href="https://chat.vite.dev/" target="_blank" className="flex justify-center items-center gap-2 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium">
              Discord
            </a>
            <a href="https://x.com/vite_js" target="_blank" className="flex justify-center items-center gap-2 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium text-center">
              X.com
            </a>
            <a href="https://bsky.app/profile/vite.dev" target="_blank" className="flex justify-center items-center gap-2 p-3 bg-slate-900/50 rounded-xl hover:bg-slate-900 transition-colors text-sm font-medium text-center">
              Bluesky
            </a>
          </div>
        </div>
      </section>

      <div className="py-20"></div>
    </div>
  )
}

export default App