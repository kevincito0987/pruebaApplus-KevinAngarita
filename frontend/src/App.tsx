import { useState, useEffect } from 'react'
import { 
  LayoutGrid, Package, Search, Plus, ShoppingCart, 
  Edit3, Trash2, Tag, Github, MoreVertical 
} from 'lucide-react'

// Importación de tus componentes
import ProductForm from './components/ProductForm'
import CategoryForm from './components/CategoryForm'
import heroBg from './assets/hero-bg.png'
import ProductEditForm from './components/ProductEditForm'
import CategoryEditForm from './components/CategoryEditForm'

interface Category { id: number; name: string; }
interface Product { id: number; name: string; price: number; code: string; category_id: number; image?: string; }

function App() {
  const [activeTab, setActiveTab] = useState('Home')
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null) // Nuevo estado
  const [expandedCategoryId, setExpandedCategoryId] = useState<number | null>(null);

  const toggleCategory = (id: number) => {
  setExpandedCategoryId(expandedCategoryId === id ? null : id);
};

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://0.0.0.0:8000/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  }
  const fetchCategories = async () => {
    try {
      const res = await fetch('http://0.0.0.0:8000/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    }
  }

  const handleDelete = async () => {
  if (!productToDelete) return;

  try {
    const res = await fetch(`http://0.0.0.0:8000/products/code/${productToDelete.code}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await fetchProducts(); // Refrescamos la lista
      setProductToDelete(null); // Cerramos el modal
    } else {
      alert("No se pudo eliminar el producto");
    }
  } catch (error) {
    console.error("Error al eliminar:", error);
    alert("Error de conexión");
  }
};

const handleCategoryDelete = async () => {
  if (!categoryToDelete) return;

  try {
    const res = await fetch(`http://0.0.0.0:8000/categories/${categoryToDelete.id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      await fetchCategories(); // Refrescamos categorías
      await fetchProducts();
      setCategoryToDelete(null); // Cerramos modal
    } else {
      alert("No se pudo eliminar la categoría");
    }
  } catch (error) {
    console.error("Error al eliminar categoría:", error);
    alert("Error de conexión");
  }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetch('http://0.0.0.0:8000/categories');
        setCategories(await catRes.json());
        await fetchProducts();
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    }
    fetchData();
  }, [])

  const filteredProducts = selectedCategoryId === 'all' 
    ? products 
    : products.filter(p => p.category_id === selectedCategoryId)

  return (
    <div className="flex min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-cyan-500/30">
      
      {showProductModal && (
        <ProductForm 
          categories={categories} 
          onClose={() => setShowProductModal(false)} 
          onProductCreated={fetchProducts} 
        />
      )}

      {editingCategory && (
        <CategoryEditForm 
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
          onCategoryUpdated={fetchCategories}
        />
      )}
      {categoryToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] border border-orange-500/20 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Tag className="w-10 h-10 text-orange-500" />
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">¿Eliminar Categoría?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Estás por borrar <span className="text-white font-bold">{categoryToDelete.name}</span>. 
              Los productos vinculados quedarán sin categoría asignada.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setCategoryToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCategoryDelete}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-900/20 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showCategoryModal && (
        <CategoryForm onClose={() => setShowCategoryModal(false)} onRefresh={fetchCategories}/>
      )}
      {/* NUEVO: Modal de Edición */}
      {editingProduct && (
        <ProductEditForm 
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(null)}
          onProductUpdated={fetchProducts}
        />
      )}
      {productToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-[#020617]/95 backdrop-blur-md">
          <div className="bg-[#1e293b] w-full max-w-sm rounded-[2.5rem] border border-red-500/20 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-red-500" />
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">¿Estás seguro?</h2>
            <p className="text-slate-400 text-sm mb-8">
              Estás a punto de eliminar <span className="text-white font-bold">{productToDelete.name}</span>. 
              Esta acción no se puede deshacer.
            </p>

            <div className="flex gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-[10px]"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white font-black py-4 rounded-2xl shadow-lg shadow-red-900/20 transition-all active:scale-95 uppercase tracking-widest text-[10px]"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 border-r border-slate-800/60 flex flex-col items-center py-8 gap-8 bg-[#0f172a] z-30">
        <div className="flex items-center gap-3 px-4">
          <div className="p-2.5 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-900/20">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <span className="hidden md:block font-black text-xl tracking-tighter text-white uppercase italic">
            Retail<span className="text-cyan-500 text-2xl">.</span>
          </span>
        </div>
        
        <nav className="flex flex-col w-full gap-2 px-4">
          {[
            { name: 'Home', icon: LayoutGrid },
            { name: 'Inventory', icon: Package },
            { name: 'Categories', icon: Tag },
          ].map((item) => (
            <button 
              key={item.name} 
              onClick={() => setActiveTab(item.name)} 
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                activeTab === item.name 
                ? 'bg-cyan-600/10 text-cyan-400 border border-cyan-500/20 shadow-inner shadow-cyan-500/5' 
                : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <item.icon className={`w-6 h-6 ${activeTab === item.name ? 'text-cyan-400' : ''}`} />
              <span className="hidden md:block font-bold">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER GLOBAL */}
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 bg-[#0f172a]/80 backdrop-blur-xl z-20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-2.5 pl-12 text-sm outline-none focus:border-cyan-500/40" 
            />
          </div>
          
          <div className="flex gap-4">
            {activeTab === 'Categories' ? (
              <button onClick={() => setShowCategoryModal(true)} className="flex items-center gap-2 bg-white text-[#0f172a] hover:bg-cyan-50 px-6 py-2.5 rounded-xl font-black text-xs shadow-xl transition-all active:scale-95">
                 <Plus className="w-4 h-4" /> CATEGORÍA
              </button>
            ) : (
              <button onClick={() => setShowProductModal(true)} className="flex items-center gap-2 bg-white text-[#0f172a] hover:bg-cyan-50 px-6 py-2.5 rounded-xl font-black text-xs shadow-xl transition-all active:scale-95">
                 <Plus className="w-4 h-4" /> PRODUCTO
              </button>
            )}
          </div>
        </header>

        <section className="p-8 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* VISTA HOME - SECCIÓN HERO LIMPIA */}
          {activeTab === 'Home' && (
            <div 
              style={{ backgroundImage: `url(${heroBg})` }} 
              className="relative min-h-[75vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-slate-950 border border-slate-800/50 mt-4 animate-in fade-in zoom-in-95 duration-1000 bg-cover bg-center bg-no-repeat z-10"
            >
              {/* Overlay oscuro para legibilidad (Sutil) */}
              <div className="absolute inset-0 bg-[#0f172a]/30 backdrop-blur-[1px] z-0"></div>

              {/* Blobs de fondo decorativos de React (Atenuados) */}
              <div className="absolute top-0 -left-20 w-96 h-96 bg-cyan-600/5 rounded-full blur-[120px] animate-pulse"></div>
              <div className="absolute bottom-0 -right-20 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px]"></div>

              <div className="relative z-10 max-w-4xl px-8 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/5 border border-cyan-500/10 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 relative z-20">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Full Stack Portfolio Project 2026
                </div>

                <h2 className="text-6xl md:text-8xl font-black text-white mb-8 leading-[0.9] tracking-tighter relative z-20">
                  Control Total, <br />
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">
                    Sin Fricción.
                    <Package className="inline w-14 h-14 text-white -mt-5 ml-4 rotate-12 drop-shadow-lg" />
                  </span>
                </h2>

                <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium relative z-20">
                  Una plataforma de gestión de inventarios de alto rendimiento. Construida con un robusto backend en <span className="text-white">FastAPI</span>, persistencia en <span className="text-white">SQL Server</span> y una interfaz reactiva en <span className="text-white">TypeScript</span>.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-20">
                  <button 
                    onClick={() => setActiveTab('Inventory')}
                    className="group relative px-10 py-5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black transition-all shadow-2xl shadow-cyan-900/40 flex items-center gap-3 overflow-hidden"
                  >
                    <Package className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    EXPLORAR APP
                  </button>
                  
                  <a 
                    href="https://github.com/kevincito0987/pruebaApplus-KevinAngarita" 
                    target="_blank"
                    className="px-10 py-5 bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-700/50 rounded-2xl font-black transition-all flex items-center gap-3 group"
                  >
                    <Github className="w-5 h-5 group-hover:text-white transition-colors" />
                    VER CÓDIGO
                  </a>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-12 mt-24 pt-12 border-t border-slate-800/50 relative z-20">
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-white">{products.length}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Items Sincronizados</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-white">{categories.length}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Categorías API</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-4xl font-black text-white">0.2s</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Latencia Media</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VISTA INVENTARIO */}
          {activeTab === 'Inventory' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-black text-white tracking-tighter mb-8 uppercase italic">Inventario</h1>
              
              {/* Filtros */}
              <div className="flex gap-2 overflow-x-auto pb-6 no-scrollbar">
                <button 
                  onClick={() => setSelectedCategoryId('all')} 
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                    selectedCategoryId === 'all' ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  Todos
                </button>
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategoryId(cat.id)} 
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      selectedCategoryId === cat.id ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group bg-slate-900/40 border border-slate-800/60 rounded-[2.5rem] p-5 hover:border-cyan-500/40 transition-all relative">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                      <button onClick={() => setEditingProduct(product)} className="p-2.5 bg-slate-950/80 backdrop-blur-md text-cyan-400 rounded-xl border border-slate-800 hover:bg-cyan-600 hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setProductToDelete(product)} className="p-2.5 bg-slate-950/80 backdrop-blur-md text-red-400 rounded-xl border border-slate-800 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <div className="aspect-square bg-white rounded-[2rem] mb-5 flex items-center justify-center p-6 shadow-inner">
                       <img src={product.image || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-4 line-clamp-1 group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                    <div className="flex justify-between items-center border-t border-slate-800 pt-4">
                      <span className="text-xl font-black text-white">$ {product.price.toFixed(2)}</span>
                      <span className="text-[10px] font-black text-slate-500 border border-slate-800 px-3 py-1 rounded-lg uppercase tracking-widest">{product.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISTA CATEGORÍAS */}
            {activeTab === 'Categories' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
                <h1 className="text-3xl font-black text-white tracking-tighter mb-2 uppercase italic">Categorías</h1>
                <p className="text-slate-500 mb-10 font-medium">Administra los grupos y departamentos de productos.</p>
                
                <div className="grid grid-cols-1 gap-4"> {/* Cambiado a 1 columna para mejor despliegue */}
                  {categories.map(cat => {
                    const isExpanded = expandedCategoryId === cat.id;
                    const relatedProducts = products.filter(p => p.category_id === cat.id);

                    return (
                      <div key={cat.id} className="flex flex-col gap-2">
                        {/* CARD DE CATEGORÍA */}
                        <div 
                          onClick={() => toggleCategory(cat.id)}
                          className={`bg-slate-900/40 border ${isExpanded ? 'border-cyan-500/50 bg-slate-800/40' : 'border-slate-800'} p-6 rounded-[2rem] flex items-center justify-between hover:border-slate-600 transition-all group cursor-pointer`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl transition-colors ${isExpanded ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-500 group-hover:text-cyan-400'}`}>
                              <Tag className="w-6 h-6" />
                            </div>
                            <div>
                              <span className="text-lg font-bold text-white uppercase tracking-tight">{cat.name}</span>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{relatedProducts.length} Productos</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}> {/* Evita que los botones cierren el acordeón */}
                            <button onClick={() => setEditingCategory(cat)} className="p-3 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded-xl transition-all"><Edit3 className="w-5 h-5" /></button>
                            <button onClick={() => setCategoryToDelete(cat)} className="p-3 text-slate-500 hover:text-red-500 hover:bg-slate-800 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </div>

                        {/* DESPLIEGUE DE PRODUCTOS RELACIONADOS */}
                        {isExpanded && (
                          <div className="mx-6 p-4 bg-slate-950/50 border-x border-b border-slate-800 rounded-b-[2rem] animate-in slide-in-from-top-2 duration-300">
                            {relatedProducts.length > 0 ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {relatedProducts.map(prod => (
                                  <div key={prod.id} className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-2xl border border-slate-800/50">
                                    <img src={prod.image || 'https://via.placeholder.com/50'} alt={prod.name} className="w-10 h-10 object-contain rounded-lg bg-white p-1" />
                                    <div className="flex-1 overflow-hidden">
                                      <p className="text-sm font-bold text-slate-200 truncate">{prod.name}</p>
                                      <p className="text-[10px] text-cyan-500 font-black">$ {prod.price.toFixed(2)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-center py-4 text-xs text-slate-600 font-bold uppercase tracking-tighter">Sin productos en esta categoría</p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
        </section>
      </main>
    </div>
  )
}

export default App