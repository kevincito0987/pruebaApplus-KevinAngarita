import requests
from sqlmodel import Session, select
from models import Product


def sync_external_api_data(db: Session):
    # Aquí pondremos la URL real más adelante
    response = requests.get("https://api.ejemplo.com/productos")
    if response.status_code == 200:
        external_data = response.json()
        for item in external_data:
            statement = select(Product).where(Product.code == item['code'])
            existing_product = db.exec(statement).first()
            if not existing_product:
                new_product = Product(
                    code=item['code'],
                    name=item['name'],
                    price=item['price'],
                    category_id=item['category_id']
                )
                db.add(new_product)
        db.commit()
