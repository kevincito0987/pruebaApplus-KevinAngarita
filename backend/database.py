from sqlmodel import SQLModel, create_engine, Session
import os

# Cargamos las variables desde el entorno (inyectadas por el devcontainer)
password = os.getenv("SQL_PASSWORD", "PasswordApplus2026!")
port = os.getenv("SQL_PORT", "1433")

# Cadena de conexión para SQL Server usando el servicio del docker-compose
DATABASE_URL = f"mssql+pyodbc://sa:{password}@sqlserver_db:{port}/master?driver=ODBC+Driver+18+for+SQL+Server&Encrypt=yes&TrustServerCertificate=yes"

engine = create_engine(DATABASE_URL, echo=True)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
