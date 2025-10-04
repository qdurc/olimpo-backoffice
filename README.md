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