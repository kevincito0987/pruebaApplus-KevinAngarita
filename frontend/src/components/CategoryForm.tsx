import { useState } from 'react'
import { FolderPlus, X } from 'lucide-react'

interface CategoryFormProps {
  onClose: () => void;
  onRefresh: () => void; 
}

export default function CategoryForm({ onClose, onRefresh }: CategoryFormProps) {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert("El nombre es obligatorio")
    
    setIsLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name,
          product_codes: [] // Mandamos la lista vacía para cumplir con el esquema del backend
        })
      })

      if (response.ok) {
        if (typeof onRefresh === 'function') {
          await onRefresh(); 
        }
        onClose(); 
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || "No se pudo crear"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      onClose();
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Nueva Categoría</h2>
          <button onClick={onClose} type="button" className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-purple-500 ml-1">
              Nombre de la Categoría
            </label>
            <div className="relative">
              <FolderPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                type="text" 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:border-purple-500/50 focus:outline-none text-white transition-all" 
                placeholder="Ej. Hardware, Periféricos..." 
              />
            </div>
          </div>

          <button 
            disabled={isLoading} 
            type="submit" 
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black shadow-lg shadow-purple-900/20 transition-all active:scale-95 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : 'CREAR CATEGORÍA'}
          </button>
        </form>
      </div>
    </div>
  )
}