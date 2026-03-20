from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session, create_db_and_tables
from models import Product, Category
from services import sync_external_api_data
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Applus K2 API")

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción pondríamos la URL del front
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/sync")
def sync_data(db: Session = Depends(get_session)):
    success = sync_external_api_data(db)
    if not success:
        raise HTTPException(
            status_code=500, detail="Error al sincronizar con la API externa")

    total_products = db.exec(select(Product)).all()
    return {
        "status": "success",
        "message": "Datos sincronizados con Fake Store API",
        "total_in_db": len(total_products)
    }


@app.get("/products")
def list_products(db: Session = Depends(get_session)):
    return db.exec(select(Product)).all()


@app.post("/products", status_code=201)
def create_product(product: Product, db: Session = Depends(get_session)):
    # Verificamos si el código ya existe para evitar errores de llave duplicada
    statement = select(Product).where(Product.code == product.code)
    existing = db.exec(statement).first()

    if existing:
        raise HTTPException(
            status_code=400, detail="El código del producto ya existe")

    db.add(product)
    db.commit()
    # Esto recupera el ID generado y las fechas por defecto
    db.refresh(product)
    return product


@app.put("/products/{product_id}")
def update_product(product_id: int, product_data: Product, db: Session = Depends(get_session)):
    # 1. Buscar el producto actual
    db_product = db.get(Product, product_id)
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # 2. Lógica de validación de código (si el código cambia)
    if product_data.code != db_product.code:
        statement = select(Product).where(Product.code == product_data.code)
        exists = db.exec(statement).first()
        if exists:
            raise HTTPException(
                status_code=400, detail="El nuevo código ya está en uso")

    # 3. Actualizar campos
    db_product.name = product_data.name
    db_product.price = product_data.price
    db_product.code = product_data.code
    db_product.category_id = product_data.category_id
    db_product.updated_at = datetime.utcnow()  # Actualizamos la estampa de tiempo

    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_session)):
    # 1. Buscar el producto
    db_product = db.get(Product, product_id)

    # 2. Si no existe, lanzamos 404
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    # 3. Eliminar de la sesión y confirmar
    db.delete(db_product)
    db.commit()

    return {"status": "success", "message": f"Producto {product_id} eliminado correctamente"}

@app.get("/categories")
def list_categories(db: Session = Depends(get_session)):
    return db.exec(select(Category)).all()

# El resto de tus métodos (POST, DELETE) van aquí siguiendo este formato limpio
