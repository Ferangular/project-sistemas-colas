# Sistema de Gestión de Colas - Full Stack

Proyecto completo para la gestión de tickets y colas de atención al cliente, implementado con arquitectura moderna y WebSockets para comunicación en tiempo real.

## 🏗️ Arquitectura del Proyecto

```
04_Sistemas colas/
├── bun-sistema-colas/     # Backend API con WebSockets
├── front-ticket/          # Frontend React
├── .gitignore            # Archivo de exclusiones Git
└── README.md             # Este archivo
```

## 🚀 Tecnologías Utilizadas

### Backend (`bun-sistema-colas/`)
- **Runtime**: Bun (JavaScript/TypeScript)
- **WebSockets**: Nativo con Bun.serve()
- **Validación**: Zod para schemas de datos
- **Arquitectura**: MVC con handlers y servicios
- **Hot Reload**: Desarrollo con `bun --hot`

### Frontend (`front-ticket/`)
- **Framework**: Angular 21
- **Estado**: Services y RxJS
- **Estilos**: TailwindCSS
- **Build**: Angular CLI

## 📋 Funcionalidades Principales

### Sistema de Tickets
- ✅ Creación de tickets (normales y preferenciales)
- ✅ Gestión de múltiples escritorios/puestos
- ✅ Sistema de colas FIFO con prioridades
- ✅ Llamado de siguiente ticket por escritorio
- ✅ Estado en tiempo real de todas las colas

### Comunicación WebSocket
- 🔄 Actualizaciones en tiempo real
- 📡 Broadcast a todos los clientes conectados
- 🔔 Notificaciones instantáneas de cambios
- 🎯 Canales de comunicación personalizados

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v18+) o Bun runtime
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd 04_Sistemas colas
   ```

2. **Instalar dependencias del Backend**
   ```bash
   cd bun-sistema-colas
   bun install
   # o con npm: npm install
   ```

3. **Instalar dependencias del Frontend**
   ```bash
   cd ../front-ticket
   npm install
   # o con yarn: yarn install
   ```

## 🚀 Ejecución del Proyecto

### Backend
```bash
cd bun-sistema-colas

# Modo desarrollo con hot reload
bun dev

# Modo producción
bun start
```

El backend se ejecuta en el puerto **3200** por defecto.

### Frontend
```bash
cd front-ticket

# Modo desarrollo
npm start

# Build para producción
npm run build

# Build con watch
npm run watch
```

El frontend se ejecuta en el puerto **4200** por defecto (Angular CLI).

## 📡 API WebSocket

### Mensajes del Cliente

#### Obtener Estado Actual
```json
{
  "type": "GET_STATE"
}
```

#### Crear Ticket Normal
```json
{
  "type": "CREATE_TICKET",
  "payload": {
    "isPreferential": false
  }
}
```

#### Crear Ticket Preferencial
```json
{
  "type": "CREATE_TICKET",
  "payload": {
    "isPreferential": true
  }
}
```

#### Solicitar Siguiente Ticket
```json
{
  "type": "REQUEST_NEXT_TICKET",
  "payload": {
    "deskNumber": 1,
    "forceNormalTicket": false
  }
}
```

#### Reiniciar Cola
```json
{
  "type": "RESET_QUEUE"
}
```

### Mensajes del Servidor

El servidor responde con mensajes que contienen:
- Estado actual de las colas
- Confirmación de acciones
- Actualizaciones en tiempo real

## 🏛️ Arquitectura del Backend

### Estructura de Directorios
```
bun-sistema-colas/
├── src/
│   ├── config/          # Configuración del servidor
│   ├── handlers/        # Manejadores de mensajes WebSocket
│   ├── schemas/         # Validación de datos con Zod
│   ├── services/        # Lógica de negocio
│   ├── store/           # Estado de la aplicación
│   ├── types/           # Definiciones de tipos TypeScript
│   ├── utils/           # Utilidades varias
│   ├── index.ts         # Punto de entrada
│   └── server.ts        # Configuración del servidor WebSocket
├── public/              # Archivos estáticos
└── package.json         # Dependencias y scripts
```

### Patrones de Diseño
- **Schema Validation**: Validación centralizada con Zod
- **Discriminated Union**: Tipos seguros para mensajes
- **Event-Driven**: Arquitectura basada en eventos WebSocket
- **Service Layer**: Separación de lógica de negocio

## 🎨 Frontend Architecture

### Componentes Principales
- **TicketDisplayComponent**: Muestra tickets actuales
- **QueueManagerComponent**: Gestión de colas
- **DeskPanelComponent**: Panel de control por escritorio
- **WebSocketService**: Servicio de conexión WebSocket

## 🔧 Configuración

### Variables de Entorno (Backend)
```env
PORT=3200
DEFAULT_CHANNEL=default-channel
```

### Configuración de Desarrollo
- Hot reload activo con `bun --hot`
- Recarga automática al guardar cambios
- Validación de tipos en tiempo de compilación

## 📦 Scripts Disponibles

### Backend
```json
{
  "dev": "kill-port 3200 && bun --hot src/index.ts",
  "start": "kill-port 3200 && bun src/index.ts",
  "kill-port": "for /f \"tokens=5\" %a in ('netstat -ano ^| findstr :3200') do taskkill /PID %a /F"
}
```

### Frontend
```json
{
  "start": "ng serve",
  "build": "ng build",
  "watch": "ng build --watch --configuration development",
  "test": "ng test"
}
```

## 🔄 Flujo de Trabajo

1. **Cliente Frontend** se conecta al WebSocket
2. **Backend** valida y procesa mensajes
3. **Sistema de Colas** gestiona el estado
4. **Broadcast** actualiza todos los clientes
5. **Frontend** refleja cambios en tiempo real

## 🐛 Solución de Problemas

### Puerto Ocupado
```bash
# Matar proceso en puerto 3200
bun run kill-port
```

### Dependencias
```bash
# Reinstalar dependencias
bun install
cd ../front-ticket && npm install
```

### Conexión WebSocket
- Verificar que el backend esté corriendo
- Confirmar puerto correcto (3200)
- Revisar configuración del firewall

## 🚀 Despliegue

### Backend
```bash
# Build para producción
bun build src/index.ts --outdir dist
node dist/index.js
```

### Frontend
```bash
# Build para producción
npm run build
# Deploy de archivos dist/ en servidor web
```

## 📄 Licencia

MIT License - Libre uso y modificación

## 🤝 Contribuciones

1. Fork del proyecto
2. Feature branch (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Nueva funcionalidad'`)
4. Push al branch (`git push origin feature/nueva-funcionalidad`)
5. Pull Request

---

**Desarrollado con ❤️ usando Bun, Angular y WebSockets**
