import { useState } from 'react'
import { X, Package, DollarSign, Hash, ImageIcon } from 'lucide-react'

interface Category { id: number; name: string; }
interface Product { id: number; name: string; price: number; code: string; category_id: number; image?: string; }

interface ProductEditFormProps {
  product: Product;
  categories: Category[];
  onClose: () => void;
  onProductUpdated: () => void;
}

const ProductEditForm = ({ product, categories, onClose, onProductUpdated }: ProductEditFormProps) => {
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    code: product.code, // El código se usa para la ruta, pero lo mostramos
    category_id: product.category_id.toString(),
    image: product.image || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://0.0.0.0:8000/products/code/${product.code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          image: formData.image,
          category_id: parseInt(formData.category_id)
        }),
      });

      if (response.ok) {
        onProductUpdated();
        onClose();
      } else {
        const error = await response.json();
        alert(`Error: ${error.detail || 'No se pudo actualizar'}`);
      }
    } catch (error) {
      alert("Error de conexión con el servidor");
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#020617]/90 backdrop-blur-md">
      <div className="bg-[#1e293b] w-full max-w-md rounded-[2.5rem] border border-slate-700 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-8 border-b border-slate-800 bg-slate-800/50">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Editar Producto</h2>
            <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest mt-1">Ref: {product.code}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1">Nombre</label>
            <div className="relative">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" required className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Precio</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="number" step="0.01" required className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
              </div>
            </div>
            <div className="space-y-2 opacity-60">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Código (No editable)</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input type="text" disabled className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-12 text-slate-500 outline-none cursor-not-allowed" value={formData.code} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">URL de Imagen</label>
            <div className="relative">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="url" className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 text-white outline-none focus:border-cyan-500/50" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Categoría</label>
            <select className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 px-4 text-white outline-none focus:border-cyan-500/50 appearance-none cursor-pointer" value={formData.category_id} onChange={(e) => setFormData({...formData, category_id: e.target.value})}>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#1e293b]">{cat.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl shadow-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs mt-4">
            Actualizar Cambios
          </button>
        </form>
      </div>
    </div>
  )
}

export default ProductEditForm