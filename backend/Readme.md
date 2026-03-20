# ⚙️ Applus+ K2 - Backend API (FastAPI)

Este módulo constituye el núcleo de procesamiento de la prueba técnica para **Applus+**. Se trata de una REST API construida con **FastAPI** que implementa un patrón de diseño **MVC** (Modelo-Vista-Controlador) para gestionar productos y categorías en un entorno de contenedores. [cite: 59, 60]

## 🛠️ Stack Tecnológico

* **Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12). 
* **ORM:** [SQLModel](https://sqlmodel.tiangolo.com/) (Basado en SQLAlchemy y Pydantic).
* **Base de Datos:** Microsoft SQL Server 2022 (vía `pyodbc` y `msodbcsql18`).
* **Servidor ASGI:** [Uvicorn](https://www.uvicorn.org/).

## 🏗️ Arquitectura de Software (MVC)

El backend está organizado de forma modular para garantizar escalabilidad y limpieza:

* `main.py`: Punto de entrada de la aplicación y definición de rutas (Controller).
* `models.py`: Definición de las entidades `Product` y `Category` con sus respectivas relaciones y estampas de tiempo.
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
## 🔄 Origen de Datos y Sincronización

Para poblar el sistema inicialmente y demostrar las capacidades de integración, este backend consume datos de una fuente externa:

- **API de Referencia:** [Fake Store API](https://fakestoreapi.com/)
- **Endpoint utilizado:** `https://fakestoreapi.com/products`

**Proceso de Integración:**

1. **Consumo:** El backend realiza peticiones asíncronas a la API externa para obtener el catálogo de productos.
2. **Transformación:** Los datos se mapean al esquema de **SQLModel** definido en `models.py`.
3. **Persistencia:** La lógica en `services.py` se encarga de insertar estos datos en la base de datos **Microsoft SQL Server**.
4. **Operatividad:** Una vez que los datos residen en la base de datos local, el sistema habilita el ciclo de vida completo (**CRUD**), permitiendo crear, editar, listar y eliminar productos de forma independiente a la API original.


## 🔌 Endpoints Principales

* `GET /docs`: Documentación interactiva (Swagger UI).
* `GET /products`: Listado y gestión de productos.
* `GET /categories`: Gestión completa de categorías (CRUD).
* `GET /sync`: Servicio de sincronización con Fake Store API.
* `POST /categories`: Creación de categorías con vinculación opcional.
* `PUT /categories/{id}`: Actualización de nombres de categorías.
* `DELETE /categories/{id}`: Eliminación lógica/física de categorías.

---

> "No te detengas cuando estés cansado, detente cuando hayas terminado. Cada línea de código es un paso más hacia la maestría." 🚀