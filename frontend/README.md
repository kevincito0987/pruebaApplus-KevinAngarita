# 🎨 Applus+ K2 - Frontend (Product Management)

Este módulo contiene la interfaz de usuario desarrollada para la gestión de productos y categorías, cumpliendo con los requerimientos técnicos de la prueba de entrada[cite: 3]. Se ha priorizado la velocidad de desarrollo y una experiencia de usuario fluida (UX) utilizando las herramientas más modernas del ecosistema React.

## 🎨 Diseño y UX
El concepto visual y la interfaz de usuario (UI) se basaron en el siguiente recurso de la comunidad de Figma, adaptando el estilo "Dark Mode" para dispositivos de gestión:
* **Referencia de Diseño:** [Food POS - Dark Tablet Device](https://www.figma.com/community/file/944188956363619079/food-pos-dark-tablet-device)

## 🚀 Stack Tecnológico

* **Framework:** [React 19](https://react.dev/) con **TypeScript**.
* **Herramienta de Construcción:** [Vite](https://vite.dev/) (Optimizado para HMR).
* **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Motor de alto rendimiento).
* **Gestor de Paquetes:** [pnpm](https://pnpm.io/) (Instalaciones rápidas y eficientes).

## 🛠️ Configuración del Entorno

Al estar dentro de un **Dev Container**, las herramientas ya están preconfiguradas. Para levantar el servidor de desarrollo, utiliza los siguientes comandos dentro de la carpeta `frontend`:

```bash
pnpm install
pnpm run dev --host
```



## 📋 Características Implementadas

1. **Dashboard Principal:** Interfaz moderna con soporte para Modo Oscuro y diseño limpio.

2. **Arquitectura de Componentes:** Estructura escalable basada en tipos de TypeScript para asegurar la integridad de los datos.

   

   

3. **Diseño Responsivo:** Adaptabilidad total a diferentes resoluciones mediante las utilidades de Tailwind v4.

4. **Flujo de Usuario:** Preparado para las operaciones CRUD solicitadas:

   

   

   - **Listar productos**.

     

     

   - **Crear productos** con código único.

     

     

   - **Editar productos**.

     

     

   - **Eliminar productos** con confirmación de seguridad.

     

     

------

> "El código limpio siempre parece que fue escrito por alguien a quien le importa." — *Robert C. Martin*