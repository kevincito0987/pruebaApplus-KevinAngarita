import { useState } from 'react'
import { X, Package, DollarSign, Hash, Layers, Image as ImageIcon } from 'lucide-react'

interface Category { id: number; name: string; }

interface ProductFormProps {
  categories: Category[];
  onClose: () => void;
  onProductCreated: () => void;
}

const ProductForm = ({ categories, onClose, onProductCreated }: ProductFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    code: '',
    category_id: categories[0]?.id || '',
    image: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://127.0.0.1:8000/products', { // Cambiado a 127.0.0.1
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Enviamos SOLO los campos que SQLModel espera para la tabla,
        // exactamente igual a como lo hiciste en Postman.
        code: formData.code,
        name: formData.name,
        price: parseFloat(formData.price),
        image: formData.image || "",
        category_id: parseInt(formData.category_id.toString())
      }),
    });

    if (response.ok) {
      onProductCreated();
      onClose();
    } else {
      const error = await response.json();
      alert(`Error: ${error.detail || 'Error al crear'}`);
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Error de conexión");
  }
}

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md">
      <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-800/50">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Nuevo Producto</h2>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Conexión: SQL Server + FastAPI</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1">Nombre del producto</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Ej. Mochila Pro"
                required 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50 transition-all" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Campo Precio */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio (USD)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="number" 
                  step="0.01" 
                  required 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" 
                  value={formData.price} 
                  onChange={(e) => setFormData({...formData, price: e.target.value})} 
                />
              </div>
            </div>
            {/* Campo Código */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código SKU</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="SKU-001"
                  required 
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})} 
                />
              </div>
            </div>
          </div>

          {/* URL de Imagen */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Imagen (Directa)</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/..." 
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" 
                value={formData.image} 
                onChange={(e) => setFormData({...formData, image: e.target.value})} 
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
            <select 
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 px-4 text-white outline-none focus:border-cyan-500/50 appearance-none cursor-pointer" 
              value={formData.category_id} 
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#1e293b]">{cat.name}</option>
              ))}
            </select>
          </div>

          <button 
            type="submit" 
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-cyan-900/20 transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs mt-4"
          >
            Guardar Producto
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductForm