# 🚀 Prueba Técnica - Full Stack Developer (Applus+ K2)

Este repositorio contiene la solución a la prueba técnica para la posición de Desarrollador Full Stack. El proyecto consiste en un sistema de gestión (CRUD) de productos y categorías utilizando un stack moderno y robusto.



## 🛠️ Stack Tecnológico

- 

  **Backend:** Python con **FastAPI**.

  

  

- 

  **Base de Datos:** **SQL Server**.

  

  

- 

  **Frontend:** **React** con TypeScript y Tailwind CSS.

  

  

- **Contenerización:** Docker y Dev Containers para un entorno de desarrollo reproducible.

## 📋 Requerimientos del Proyecto

El sistema permite realizar las siguientes operaciones sobre las entidades **Category** y **Product**:



1. 

   **Listar productos**.

   

   

2. 

   **Crear productos** con validación de código único.

   

   

3. 

   **Editar productos** existentes.

   

   

4. 

   **Eliminar productos** con confirmación obligatoria del usuario.

   

   

Entidades:



- 

  **Category:** `name`, `createdAt`, `updatedAt`.

  

  

- 

  **Product:** `code` (único), `name`, `category` (relación), `price`, `createdAt`, `updatedAt`.

  

  

------

## 💾 SQL - El reporte incompleto (Solución)



**Problema:** El query original no mostraba los departamentos que no tenían empleados asignados debido a que la cláusula `WHERE` filtraba los valores `NULL` resultantes del `LEFT JOIN`.

Corrige el query para que muestre todos los departamentos (incluso los vacíos).

#### ✅ Query Corregido (Solución)

Para mantener todos los departamentos (incluso los vacíos) y filtrar solo a los empleados activos, la condición debe formar parte de la unión (`JOIN`):

SQL

```
SELECT 
    d.DepartmentName,
    e.FirstName,
    e.LastName
FROM Departments d
LEFT JOIN Employees e 
    ON d.DepartmentID = e.DepartmentID 
    AND e.IsActive = 1;
```

## 💡 Análisis de la Solución

1. **Uso de LEFT JOIN:** Asegura que la tabla de la izquierda (`Departments`) sea la base del resultado, manteniendo todos sus registros.
2. **Condición en el ON:** Al mover `e.IsActive = 1` al `ON`, el filtro aplica únicamente a la tabla de la derecha (`Employees`) durante el proceso de emparejamiento. Si un empleado no es activo, simplemente no se une, dejando los campos como `NULL`, pero **sin eliminar** la fila del departamento.
3. **Resultado:** Se obtiene un reporte íntegro con la lista completa de departamentos y el detalle de sus colaboradores activos.



## 🚀 Instalación y Uso

## Requisitos previos

- Docker y Docker Compose.
- VS Code con la extensión *Dev Containers*.

## Pasos para ejecutar:

1. Clonar el repositorio.
2. Abrir el proyecto en VS Code.
3. Seleccionar la opción **"Reopen in Container"** cuando se solicite.
4. Ejecutar las migraciones y el servidor (instrucciones detalladas próximamente).