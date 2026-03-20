from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from database import get_session, create_db_and_tables
from models import Product
from services import sync_external_api_data

app = FastAPI(title="Applus K2 API")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/sync")
def sync_data(db: Session = Depends(get_session)):
    sync_external_api_data(db)
    return {"message": "Datos sincronizados con éxito"}


@app.get("/products")
def list_products(db: Session = Depends(get_session)):
    return db.exec(select(Product)).all()

# El resto de tus métodos (POST, DELETE) van aquí siguiendo este formato limpio
