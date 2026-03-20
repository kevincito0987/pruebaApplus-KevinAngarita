# ⚙️ Applus+ K2 - Backend API (FastAPI)

[cite_start]Este módulo constituye el núcleo de procesamiento de la prueba técnica para **Applus+**. [cite: 57, 59] [cite_start]Se trata de una REST API construida con **FastAPI** que implementa un patrón de diseño **MVC** (Modelo-Vista-Controlador) para gestionar productos y categorías en un entorno de contenedores. [cite: 59, 60]

## 🛠️ Stack Tecnológico

* [cite_start]**Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12). [cite: 59]
* **ORM:** [SQLModel](https://sqlmodel.tiangolo.com/) (Basado en SQLAlchemy y Pydantic).
* [cite_start]**Base de Datos:** Microsoft SQL Server 2022 (vía `pyodbc` y `msodbcsql18`). [cite: 59]
* **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/).

## 🏗️ Arquitectura de Software (MVC)

El backend está organizado de forma modular para garantizar escalabilidad y limpieza:

* `main.py`: Punto de entrada de la aplicación y definición de rutas (Controller).
* [cite_start]`models.py`: Definición de las entidades `Product` y `Category` con sus respectivas relaciones y estampas de tiempo. [cite: 61, 65, 70, 71]
* `database.py`: Configuración de la conexión y motor de SQL Server utilizando variables de entorno.
* `services.py`: Lógica de negocio para la sincronización de datos con APIs externas.

## 🚀 Instalación y Ejecución

Al trabajar dentro de un **Dev Container**, el driver de SQL Server ya está preinstalado. Sigue estos pasos para activar el servidor:

1.  **Activar Entorno Virtual:**
    ```bash
    source venv/bin/activate
    ```
2.  **Instalar Dependencias:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Lanzar Servidor de Desarrollo:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
    ```

## 🔌 Endpoints Principales

* `GET /docs`: Documentación interactiva (Swagger UI).
* [cite_start]`GET /products`: Listado completo de productos. [cite: 72]
* [cite_start]`POST /products`: Creación de nuevos productos con validación de código único. [cite: 66, 73]
* `GET /sync`: Servicio de sincronización que persiste datos externos en SQL Server.
* [cite_start]`DELETE /products/{id}`: Eliminación de productos. [cite: 75]

---

> "No te detengas cuando estés cansado, detente cuando hayas terminado. Cada línea de código es un paso más hacia la maestría." 🚀