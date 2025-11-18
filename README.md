# Hackathon #2: TechFlow Task Management - Desafío Frontend

## Descripción General

¡Bienvenidos a la Hackathon #2 de Desarrollo Basado en Plataformas! 🎉

**TechFlow** es una startup de gestión de proyectos que necesita un dashboard web para su plataforma de administración de tareas. Los equipos pueden crear proyectos, asignar tareas, hacer seguimiento del progreso y colaborar en tiempo real. Tu trabajo es construir la **aplicación web frontend** que consume su API existente.

Esta solución impacta directamente a equipos de productividad en todo el mundo al proporcionar una interfaz intuitiva para la coordinación de tareas, seguimiento de plazos y colaboración en equipo.

## Objetivo

Construir una aplicación web interactiva y funcional usando **React + TypeScript + Tailwind CSS** que permita a los usuarios:

- Registrarse, iniciar sesión y gestionar su perfil
- Visualizar un dashboard con estadísticas de proyectos y tareas
- Crear, editar y eliminar proyectos
- Gestionar tareas con filtros avanzados (estado, prioridad, proyecto, usuario asignado)
- Asignar tareas a miembros del equipo
- Ver detalles completos de proyectos y tareas
- Colaborar con el equipo visualizando actividades y asignaciones

## Ejecución local

1. Instala dependencias:

   ```bash
   cd frontend
   npm install
   ```

2. Configura las variables de entorno copiando el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

   ```env
   VITE_API_URL=https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1
   ```

3. Levanta el entorno de desarrollo:

   ```bash
   npm run dev
   ```

4. Construye y previsualiza la app para producción:

   ```bash
   npm run build
   npm run preview
   ```

### Tecnologías utilizadas

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios

### Funcionalidades implementadas

- Autenticación con login, registro, logout y refresco del perfil
- Dashboard con métricas de tareas, proyectos y actividad reciente
- Gestión integral de proyectos con búsqueda, creación, edición y eliminación
- Gestión de tareas con filtros por estado, prioridad, proyecto y responsable, detalles completos, asignación a miembros del equipo y acciones rápidas para marcar como completadas
- Vista del equipo para consultar los miembros disponibles y las tareas asignadas desde los endpoints de bonus
- Componentes reutilizables (Button, Input, Card, Modal) y servicios tipados para la API

## Autenticación y Seguridad

Todas las llamadas a la API requieren un token JWT válido en el header `Authorization: Bearer <token>` para garantizar la seguridad y privacidad de los datos.

## Requisitos Técnicos

### Stack Obligatorio

- React 18+ con TypeScript
- React Router para navegación
- Tailwind CSS para estilos
- Axios o Fetch API para peticiones HTTP

### Funcionalidades Clave a Implementar

#### 1. Autenticación (Requerido) 🔐

- Pantallas de Login y Registro
- Gestión de token JWT
- Rutas protegidas (redirección a login si no está autenticado)
- Funcionalidad de logout
- Visualización de perfil de usuario

#### 2. Dashboard (Requerido) 📊

- Vista general con estadísticas (total de tareas, completadas, pendientes, vencidas)
- Acciones rápidas (crear tarea, ver proyectos)
- Feed de actividad reciente

#### 3. Gestión de Proyectos (Requerido) 📁

- Listar todos los proyectos con paginación
- Crear nuevo proyecto (modal o página separada)
- Ver detalles de proyecto con tareas asociadas
- Actualizar información del proyecto
- Eliminar proyecto (con confirmación)
- Buscar/filtrar proyectos por nombre o estado

#### 4. Gestión de Tareas (Requerido) ✅

- Listar tareas con múltiples filtros:
  - Por estado (TODO, IN_PROGRESS, COMPLETED)
  - Por prioridad (LOW, MEDIUM, HIGH, URGENT)
  - Por proyecto
  - Por usuario asignado
- Crear tarea con validación de formulario
- Actualizar tarea (estado, prioridad, descripción, fecha límite)
- Eliminar tarea
- Asignar tarea a miembros del equipo
- Marcar tarea como completada
- Ver detalles de tarea (modal o página separada)

#### 5. Colaboración en Equipo (Requerido) 👥

- Ver miembros del equipo
- Ver tareas asignadas a cada miembro

## Documentación de la API

**URL Base:** `https://cs2031-2025-2-hackathon-2-backend-production.up.railway.app/v1`

Todos los endpoints autenticados requieren el header:

```
Authorization: Bearer <jwt_token>
```

### Endpoints de Autenticación

| Método | Endpoint | Descripción | Body de Petición | Respuesta |
|--------|----------|-------------|------------------|-----------|
| POST | `/auth/register` | Registrar nuevo usuario | `{ "email": "user@email.com", "password": "pass123", "name": "Juan Pérez" }` | `{ "message": "Usuario creado exitosamente" }` |
| POST | `/auth/login` | Iniciar sesión | `{ "email": "user@email.com", "password": "pass123" }` | `{ "token": "jwt_token", "user": { "id": "uuid", "email": "...", "name": "..." } }` |
| GET | `/auth/profile` | Obtener usuario actual | - | `{ "id": "uuid", "email": "...", "name": "...", "createdAt": "..." }` |

### Endpoints de Proyectos 🔐

| Método | Endpoint | Descripción | Body de Petición | Respuesta |
|--------|----------|-------------|------------------|-----------|
| GET | `/projects?page=1&limit=10&search=` | Listar proyectos (paginado) | - | `{ "projects": [...], "totalPages": 5, "currentPage": 1 }` |
| POST | `/projects` | Crear proyecto | `{ "name": "Proyecto Alpha", "description": "...", "status": "ACTIVE" }` | `{ "id": "uuid", "name": "...", ... }` |
| GET | `/projects/:id` | Obtener detalles de proyecto | - | `{ "id": "uuid", "name": "...", "tasks": [...] }` |
| PUT | `/projects/:id` | Actualizar proyecto | `{ "name": "Nombre Actualizado", "status": "COMPLETED" }` | `{ "id": "uuid", ... }` |
| DELETE | `/projects/:id` | Eliminar proyecto | - | `{ "message": "Proyecto eliminado" }` |

**Estados de Proyecto:** `ACTIVE`, `COMPLETED`, `ON_HOLD`

### Endpoints de Tareas 🔐

| Método | Endpoint | Descripción | Query Params | Body de Petición | Respuesta |
|--------|----------|-------------|--------------|------------------|-----------|
| GET | `/tasks` | Listar todas las tareas | `?projectId=uuid&status=TODO&priority=HIGH&page=1&limit=20` | - | `{ "tasks": [...], "totalPages": 3 }` |
| POST | `/tasks` | Crear tarea | - | `{ "title": "Implementar login", "description": "...", "projectId": "uuid", "priority": "HIGH", "dueDate": "2025-12-01", "assignedTo": "userId" }` | `{ "id": "uuid", ... }` |
| GET | `/tasks/:id` | Obtener detalles de tarea | - | - | `{ "id": "uuid", "title": "...", "status": "IN_PROGRESS", ... }` |
| PUT | `/tasks/:id` | Actualizar tarea | - | `{ "status": "COMPLETED", "priority": "MEDIUM" }` | `{ "id": "uuid", ... }` |
| DELETE | `/tasks/:id` | Eliminar tarea | - | `{ "message": "Tarea eliminada" }` |
| PATCH | `/tasks/:id/status` | Actualizar solo el estado de la tarea | - | `{ "status": "COMPLETED" }` | `{ "id": "uuid", "status": "COMPLETED" }` |

**Estados de Tarea:** `TODO`, `IN_PROGRESS`, `COMPLETED`
**Prioridades:** `LOW`, `MEDIUM`, `HIGH`, `URGENT`

### Endpoints de Equipo 🔐 (Bonus)

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| GET | `/team/members` | Listar miembros del equipo | `{ "members": [{ "id": "uuid", "name": "...", "email": "..." }] }` |
| GET | `/team/members/:id/tasks` | Obtener tareas de un miembro | `{ "tasks": [...] }` |

### Códigos de Estado HTTP

- `200 OK` - GET/PUT/PATCH exitoso
- `201 Created` - POST exitoso
- `204 No Content` - DELETE exitoso
- `400 Bad Request` - Body de petición inválido
- `401 Unauthorized` - Token faltante o inválido
- `403 Forbidden` - Permisos insuficientes
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

## Orden de Implementación Sugerido

### Fase 1: Fundamentos (30 min)

1. Configurar routing (React Router)
2. Crear páginas de autenticación (Login/Registro)
3. Implementar almacenamiento de JWT (localStorage/context)
4. Crear wrapper de rutas protegidas
5. Configurar instancia de Axios con interceptores

### Fase 2: Funcionalidades Core (60 min)

1. Dashboard con estadísticas
2. Lista de proyectos con paginación
3. Operaciones CRUD de proyectos
4. Lista de tareas con filtrado básico
5. Operaciones CRUD de tareas

### Fase 3: Pulido (30 min)

1. Filtrado avanzado (estado, prioridad, búsqueda)
2. Validación de formularios
3. Estados de carga y manejo de errores
4. Mejoras de UI y diseño responsive
5. Funcionalidades de equipo

## Consejos para el Desarrollo

1. **Comienza con la autenticación** - Todo depende de ella
2. **Crea componentes reutilizables** - Button, Input, Modal, Card, etc.
3. **Usa React Context o custom hooks** para el estado de autenticación
4. **Maneja estados de carga y error** en todas partes
5. **Implementa actualizaciones optimistas de UI** para mejor UX
6. **Usa variables de entorno** para la URL de la API
7. **Agrega interfaces de TypeScript** para todas las respuestas de la API
8. **Prueba casos extremos** (estados vacíos, errores, texto largo)

### Estructura de Proyecto Sugerida

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Card.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── projects/
│   │   ├── ProjectList.tsx
│   │   ├── ProjectCard.tsx
│   │   └── ProjectForm.tsx
│   └── tasks/
│       ├── TaskList.tsx
│       ├── TaskCard.tsx
│       └── TaskForm.tsx
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   └── Tasks.tsx
├── services/
│   ├── api.ts
│   ├── authService.ts
│   ├── projectService.ts
│   └── taskService.ts
├── context/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   └── useApi.ts
├── types/
│   └── index.ts
└── utils/
    └── constants.ts
```

## Recursos Útiles

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT Introduction](https://jwt.io/introduction/)

## Funcionalidades Bonus (Puntos Extra)

- 🌙 Toggle de modo oscuro
- 🎯 Drag & drop de tareas para cambiar estado
- 🔄 Actualizaciones en tiempo real (polling cada 5s)
- 📊 Exportar tareas a CSV
- 💬 Sistema de comentarios en tareas
- 🔔 Notificaciones para fechas límite
- 📈 Dashboard de analíticas avanzado
- 🔍 Búsqueda global (proyectos + tareas)
- 📎 Adjuntar archivos a tareas
- 🏷️ Sistema de etiquetas/tags para tareas

## Entregables

1. ✅ Repositorio público en GitHub con código completo
2. ✅ README con instrucciones para correr la app localmente
3. ✅ Link al deploy (Vercel, Netlify, etc.)
4. ✅ (Opcional) Video demo mostrando la app funcionando (2-3 min)

### Contenido Mínimo del README

Tu README debe incluir:

- Descripción breve del proyecto
- Instrucciones de instalación (`npm install`)
- Instrucciones para correr localmente (`npm run dev`)
- Link al deploy
- Tecnologías utilizadas
- Credenciales de prueba (si aplica)
- Features implementadas
- (Opcional) Screenshots de la aplicación

## Restricciones y Consideraciones Importantes

⚠️ **Importante:**

- Este proyecto es exclusivamente para plataforma web
- Deberán usar **React** con **TypeScript** obligatoriamente
- **Tailwind CSS** es requerido para los estilos
- No se permite el uso de librerías de componentes completas (Material-UI, Ant Design, etc.) - deben construir sus propios componentes
- La API está preconfigurada y lista para usar como "caja negra"
- El tiempo máximo es de **2 horas**
- Trabajarán en equipos de **4-5 estudiantes**

## Notas Finales

Esta hackathon está diseñada para evaluar su capacidad de:

- Integrar múltiples endpoints de una API REST
- Manejar autenticación y autorización
- Construir interfaces dinámicas y responsivas
- Gestionar estados complejos en React
- Trabajar bajo presión de tiempo
- Aplicar buenas prácticas de código

¡Estamos emocionados de ver lo que construirán! 🚀

Para dudas o soporte durante la hackathon, utilicen el canal oficial de Discord.

**Con cariño,**
**El equipo de CS2031** ❤️
