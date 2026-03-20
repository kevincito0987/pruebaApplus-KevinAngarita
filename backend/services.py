import requests
from sqlmodel import Session, select
from models import Product, Category


def sync_external_api_data(db: Session):
    try:
        # 1. Traer categorías de la API externa
        cat_response = requests.get(
            "https://fakestoreapi.com/products/categories")
        external_categories = cat_response.json()

        for cat_name in external_categories:
            statement = select(Category).where(Category.name == cat_name)
            existing_cat = db.exec(statement).first()
            if not existing_cat:
                new_cat = Category(name=cat_name)
                db.add(new_cat)
        db.commit()

        # 2. Traer productos de la API externa
        prod_response = requests.get("https://fakestoreapi.com/products")
        external_products = prod_response.json()

        for item in external_products:
            # Buscamos si el producto ya existe por su código (usamos el ID de la API como code)
            statement = select(Product).where(Product.code == str(item["id"]))
            existing_prod = db.exec(statement).first()

            # Buscamos la categoría local para el FK
            cat_stmt = select(Category).where(
                Category.name == item["category"])
            db_category = db.exec(cat_stmt).first()

            if not existing_prod:
                # AQUÍ ES DONDE SUCEDE LA MAGIA
                new_product = Product(
                    code=str(item["id"]),
                    name=item["title"],
                    price=float(item["price"]),
                    image=item["image"],  # <--- ESTA LÍNEA ES CLAVE
                    category_id=db_category.id if db_category else None
                )
                db.add(new_product)
            else:
                # Si ya existe, actualizamos la imagen por si acaso cambió
                existing_prod.image = item["image"]
                existing_prod.price = float(item["price"])
                db.add(existing_prod)

        db.commit()
        return True
    except Exception as e:
        print(f"Error en la sincronización: {e}")
        return False
