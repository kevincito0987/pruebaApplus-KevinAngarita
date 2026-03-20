import { useState, useEffect } from 'react'
import { Tag, X, Save } from 'lucide-react'

interface Category {
  id: number;
  name: string;
}

interface CategoryEditFormProps {
  category: Category;
  onClose: () => void;
  onCategoryUpdated: () => void;
}

export default function CategoryEditForm({ category, onClose, onCategoryUpdated }: CategoryEditFormProps) {
  const [name, setName] = useState(category.name)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return alert("El nombre no puede estar vacío")

    setIsLoading(true)
    try {
      // Ajusta la URL según tu backend (normalmente /categories/{id})
      const response = await fetch(`http://0.0.0.0:8000/categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name })
      })

      if (response.ok) {
        onCategoryUpdated()
        onClose()
      } else {
        alert("Error al actualizar la categoría")
      }
    } catch (error) {
      console.error("Error:", error)
      alert("Error de conexión")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-slate-700 w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase italic">Editar Categoría</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 ml-1">Nuevo Nombre</label>
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                type="text" 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 focus:border-cyan-500/50 focus:outline-none text-white transition-all" 
              />
            </div>
          </div>

          <button 
            disabled={isLoading} 
            type="submit" 
            className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black shadow-lg shadow-cyan-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? 'GUARDANDO...' : (
              <>
                <Save className="w-4 h-4" />
                GUARDAR CAMBIOS
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}