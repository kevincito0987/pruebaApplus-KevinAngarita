from sqlalchemy import text # Para el reseed si quieres mantener orden
from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session, create_db_and_tables
from models import Product, Category
from services import sync_external_api_data
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from sqlmodel import select
from database import engine

app = FastAPI(title="Applus K2 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # O especifica ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    with Session(engine) as session:
        try:
            # Forzamos la columna a VARCHAR(MAX) para los Base64 largos
            session.exec(
                text("ALTER TABLE product ALTER COLUMN image VARCHAR(MAX) NULL"))
            session.commit()
            print("Columna image actualizada a VARCHAR(MAX)")
        except Exception as e:
            session.rollback()
            print(f"Nota: No se pudo alterar la columna image: {e}")


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
    statement = select(Product).where(Product.code == product.code)
    existing = db.exec(statement).first()

    if existing:
        raise HTTPException(
            status_code=400, detail="El código del producto ya existe")

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@app.put("/products/code/{product_code}")
def update_product_by_code(product_code: str, product_data: Product, db: Session = Depends(get_session)):
    # 1. Buscamos el producto por su código único
    statement = select(Product).where(Product.code == product_code)
    db_product = db.exec(statement).first()

    if not db_product:
        raise HTTPException(
            status_code=404, detail=f"No existe un producto con el código: {product_code}")

    # 2. Actualizamos los campos (Excepto el código, que es la llave de búsqueda)
    db_product.name = product_data.name
    db_product.price = product_data.price
    db_product.image = product_data.image
    db_product.category_id = product_data.category_id
    db_product.updated_at = datetime.utcnow()

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product


@app.delete("/products/code/{product_code}")
def delete_product_by_code(product_code: str, db: Session = Depends(get_session)):
    statement = select(Product).where(Product.code == product_code)
    db_product = db.exec(statement).first()

    if not db_product:
        raise HTTPException(status_code=404, detail="No encontrado")

    db.delete(db_product)
    db.commit()

    # --- AQUÍ ESTÁ EL TRUCO ---
    # Buscamos el ID máximo que quedó en la tabla
    max_id_query = db.exec(text("SELECT MAX(id) FROM product")).first()
    max_id = max_id_query[0] if max_id_query[0] is not None else 0

    # Reiniciamos el contador de SQL Server para que el siguiente sea max_id + 1
    db.exec(text(f"DBCC CHECKIDENT ('product', RESEED, {max_id})"))
    db.commit()

    return {
        "status": "success",
        "message": f"Producto con código [{product_code}] eliminado con éxito."
    }


@app.get("/categories")
def list_categories(db: Session = Depends(get_session)):
    # Traemos todas las categorías de la base de datos
    statement = select(Category)
    categories = db.exec(statement).all()

    return categories


@app.get("/categories/{category_id}")
def get_category_by_id(category_id: int, db: Session = Depends(get_session)):
    # Buscamos una categoría específica por su ID
    category = db.get(Category, category_id)

    if not category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    return category

# Usamos este esquema para recibir los datos de la petición


class CategoryCreate(BaseModel):
    name: str
    product_codes: Optional[List[str]] = []


@app.post("/categories", status_code=201)
def create_category(data: CategoryCreate, db: Session = Depends(get_session)):
    # 1. Crear la categoría primero
    new_category = Category(name=data.name)
    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    if data.product_codes:
        # Buscamos los productos cuyos códigos coincidan con los strings enviados
        statement = select(Product).where(Product.code.in_(data.product_codes))
        products_to_link = db.exec(statement).all()

        for prod in products_to_link:
            prod.category_id = new_category.id  # Asignamos el ID de la nueva categoría
            db.add(prod)  # Marcamos el producto para actualizar

        db.commit()  # Guardamos los cambios en los productos
        db.refresh(new_category)

    return {
        "status": "success",
        "data": new_category  # Esto ya debería incluir .products si tienes la relación
    }

# Asegúrate de que el esquema espere strings
class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    product_codes: Optional[List[str]] = []


@app.put("/categories/{category_id}")
def update_category(category_id: int, data: CategoryUpdate, db: Session = Depends(get_session)):
    # 1. Buscar la categoría
    db_category = db.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # 2. Actualizar nombre si viene
    if data.name:
        db_category.name = data.name

    # 3. Gestión por CÓDIGOS de producto
    if data.product_codes is not None:
        # A. DESASOCIAR: Quitamos la categoría a los productos que la tenían
        old_products = db.exec(select(Product).where(
            Product.category_id == category_id)).all()
        for p in old_products:
            p.category_id = None  # Esto fallaba antes del ALTER TABLE
            db.add(p)

        db.flush()  # Empujamos los cambios de nulidad

        # B. ASOCIAR: Buscamos por el campo 'code' (string)
        if data.product_codes:
            # Seleccionamos productos cuyo código esté en la lista enviada
            statement = select(Product).where(
                Product.code.in_(data.product_codes))
            new_products = db.exec(statement).all()

            for p in new_products:
                p.category_id = db_category.id
                p.updated_at = datetime.utcnow()
                db.add(p)

    # 4. Finalizar
    db_category.updated_at = datetime.utcnow()
    db.add(db_category)
    db.commit()
    db.refresh(db_category)

    return {
        "status": "success",
        "data": {
            "id": db_category.id,
            "name": db_category.name,
            "linked_products": db_category.products
        }
    }
    

@app.delete("/categories/{category_id}")
def delete_category(category_id: int, db: Session = Depends(get_session)):
    # 1. Buscar la categoría
    db_category = db.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")

    # 2. "Liberar" los productos asociados (ponerles NULL)
    # Esto evita que SQL Server se queje por la llave foránea
    statement = select(Product).where(Product.category_id == category_id)
    linked_products = db.exec(statement).all()

    for prod in linked_products:
        prod.category_id = None
        db.add(prod)

    # 3. Borrar la categoría
    db.delete(db_category)
    db.commit()

    return {
        "status": "success",
        "message": f"Categoría '{db_category.name}' eliminada. Los productos asociados quedaron sin categoría."
    }
