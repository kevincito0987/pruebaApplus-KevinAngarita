import requests
from sqlmodel import Session, select
from models import Product, Category


def sync_external_api_data(db: Session):
    # Consumimos la Fake Store API
    url = "https://fakestoreapi.com/products"
    response = requests.get(url)

    if response.status_code == 200:
        external_products = response.json()

        for item in external_products:
            # 1. Manejo de Categorías
            category_name = item['category']
            statement_cat = select(Category).where(
                Category.name == category_name)
            db_category = db.exec(statement_cat).first()

            if not db_category:
                db_category = Category(name=category_name)
                db.add(db_category)
                db.commit()
                db.refresh(db_category)

            # 2. Manejo de Productos (usamos el ID de la API como 'code' único)
            product_code = str(item['id'])
            statement_prod = select(Product).where(
                Product.code == product_code)
            existing_product = db.exec(statement_prod).first()

            if not existing_product:
                new_product = Product(
                    code=product_code,
                    name=item['title'],
                    price=float(item['price']),
                    category_id=db_category.id
                )
                db.add(new_product)

        db.commit()
        return True
    return False
