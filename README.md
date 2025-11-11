# 🏛️ OLIMPO Backoffice

**OLIMPO** es una aplicación web desarrollada como parte del sistema integral de gestión deportiva del **Ministerio de Deportes y Recreación (MIDEREC)**.  
El **Backoffice** permite administrar las operaciones internas de la plataforma: instalaciones, usuarios, reservas y torneos.  

Diseñado con una interfaz moderna, limpia y responsiva, este módulo facilita la supervisión de datos y la toma de decisiones a nivel administrativo.

---

## 🚀 Características principales

### 🖥️ Dashboard interactivo
- Tarjetas con métricas globales: instalaciones, reservas, usuarios y torneos.
- Gráficos circulares de **actividad semanal** y **clasificación de usuarios**.
- Tabla de **próximos eventos y torneos**, con fechas, participación e inscritos.

### 🏟️ Módulo de Instalaciones
- Visualización de las instalaciones deportivas registradas.
- Datos detallados: nombre, especialidad, tipo, capacidad, horarios y estado.
- Estados visuales con etiquetas de color:
  - 🟢 **Disponible**
  - 🟠 **Mantenimiento**
  - 🔴 **Bloqueada**

### 👥 Gestión de Usuarios (en desarrollo)
- Listado de atletas y entrenadores con información de contacto.
- Columnas configurables (nombre, teléfono, correo, disciplina, etc.).
- Integración futura con CRUD (crear, editar, eliminar).

### 📅 Reservas y Torneos (en desarrollo)
- Control de reservas activas y torneos en curso.
- Información resumida en el panel principal.

---

## 🧰 Tecnologías utilizadas

| Tecnología | Descripción |
|-------------|-------------|
| **React 18 + Vite** | Framework base y empaquetador moderno. |
| **Material UI (MUI)** | Librería de componentes UI. |
| **Recharts** | Librería para gráficos y visualizaciones. |
| **React Router DOM** | Navegación entre módulos (Dashboard, Instalaciones, etc.). |
| **DiceBear Avatars API** | Generación dinámica de avatares para listas. |
| **ESLint + Prettier** | Estándares de formato y calidad de código. |

---

## 🧩 Estructura del proyecto

src/
├── components/
│ ├── Sidebar.jsx
│ └── InstalacionesTable.jsx
│
├── pages/
│ ├── DashboardPage.jsx
│ ├── InstalacionesPage.jsx
│ ├── ReservasPage.jsx
│ └── UsuarioPage.jsx
│
├── App.jsx
├── main.jsx
├── index.css

---

## ⚙️ Configuración de entorno

Antes de ejecutar cualquier script asegúrate de definir la URL base del backend:

1. Abre el archivo `.env` (ya incluido en el repo).
2. Ajusta el valor de `VITE_API_URL` para que apunte a tu API Gateway (o al mock local), por ejemplo:

   ```bash
   # para desarrollo con json-server
   VITE_API_URL=http://localhost:3001

   # para backend real
   # VITE_API_URL=https://api.miderec.gob.do/backoffice
   ```

3. Guarda los cambios y luego corre los comandos habituales (`npm install`, `npm run dev`, etc.). Vite leerá esta variable y los servicios del front consumirán automáticamente ese endpoint.

---

## 🧪 API mock con json-server

Mientras llega el API Gateway oficial puedes simularlo con el mock incluido:

1. Instala dependencias si aún no lo has hecho: `npm install`.
2. Inicia el servidor mock en otra terminal:

   ```bash
   npm run mock:api
   ```

   Esto levanta `json-server` en `http://localhost:3001` usando los datos de `mocks/api/db.json` y las rutas declaradas en `mocks/api/routes.json`.

3. Asegúrate de que `VITE_API_URL` apunte a `http://localhost:3001`.
4. Corre el front normalmente (`npm run dev`). Todas las llamadas (`/installations`, `/installation-reports`, `/reservations`, `/dashboard`) responderán con los datos mock y aceptarán operaciones básicas `POST/PUT/DELETE` según lo que provee json-server.
