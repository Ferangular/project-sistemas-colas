# Sistema de Colas con WebSockets

Un sistema de gestión de colas de tickets en tiempo real construido con Bun, TypeScript y WebSockets. Permite la creación y gestión de tickets normales y preferenciales con comunicación bidireccional entre clientes.

## 🚀 Características

- **Gestión de Tickets**: Creación de tickets normales y preferenciales
- **Sistema de Colas**: Gestión automática del orden de atención
- **WebSockets**: Comunicación en tiempo real entre clientes
- **TypeScript**: Tipado fuerte para mayor robustez
- **Validación de Datos**: Uso de Zod para validación de esquemas

## 📁 Estructura del Proyecto

```
bun-sistema-colas/
├── src/
│   ├── config/              # Configuraciones del servidor
│   │   └── server-config.ts
│   ├── handlers/            # Manejadores de mensajes WebSocket
│   │   └── message.handler.ts
│   ├── schemas/             # Esquemas de validación Zod
│   │   └── ticket.schema.ts
│   ├── services/            # Lógica de negocio
│   │   └── ticket-queue.service.ts
│   ├── store/               # Estado de la aplicación
│   │   └── ticket-queue.store.ts
│   ├── types/               # Definiciones de TypeScript
│   │   ├── index.ts
│   │   ├── queue-message-state.ts
│   │   └── ticket.ts
│   ├── utils/               # Utilidades varias
│   │   ├── generate-uuid.ts
│   │   └── index.ts
│   ├── index.ts             # Punto de entrada principal
│   └── server.ts            # Configuración del servidor WebSocket
├── public/                  # Archivos estáticos del cliente
│   ├── index.html           # Interfaz web del cliente
│   ├── styles.css           # Estilos CSS
│   └── favicon.ico          # Icono del sitio
├── .env                     # Variables de entorno (no versionado)
├── .env.template            # Plantilla de variables de entorno
├── .gitignore               # Archivos ignorados por Git
├── bun.lock                 # Lockfile de dependencias de Bun
├── package.json             # Configuración del proyecto y dependencias
├── tsconfig.json            # Configuración de TypeScript
└── README.md                # Este archivo
```

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd bun-sistema-colas

# Instalar dependencias
bun install
```

## 🏃‍♂️ Ejecución

### Modo Desarrollo
```bash
# Inicia el servidor con recarga en caliente
bun run dev
```

### Modo Producción
```bash
# Inicia el servidor normalmente
bun run start
```

### Scripts Disponibles
- `bun run dev` - Inicia el servidor en modo desarrollo con recarga en caliente
- `bun run start` - Inicia el servidor en modo producción
- `bun run kill-port` - Elimina procesos usando el puerto 3200

## 📡 API de Mensajes

### Mensajes del Cliente

| Tipo | Descripción | Payload |
|------|-------------|---------|
| `GET_STATE` | Solicita el estado actual de la cola | - |
| `CREATE_TICKET` | Crea un nuevo ticket | `{ isPreferential: boolean }` |
| `REQUEST_NEXT_TICKET` | Solicita el siguiente ticket | `{ deskNumber: number; forceNormalTicket: boolean }` |
| `RESET_QUEUE` | Reinicia la cola completamente | - |

### Mensajes del Servidor

| Tipo | Descripción | Payload |
|------|-------------|---------|
| `ERROR` | Error en la operación | `{ error: string }` |
| `TICKET_CREATED` | Ticket creado exitosamente | `{ ticket: Ticket }` |
| `NEXT_TICKET_ASSIGNED` | Siguiente ticket asignado | `{ ticket?: Ticket }` |
| `QUEUE_EMPTY` | La cola está vacía | - |
| `QUEUE_STATE` | Estado completo de la cola | `{ state: QueueMessageState }` |

## 🔧 Configuración

### Variables de Entorno
Crea un archivo `.env` basado en `.env.template`:

```env
# Configuración del servidor
PORT=3200
DEFAULT_CHANNEL_NAME=queue-channel
```

### Configuración del Servidor
El servidor se configura en `src/config/server-config.ts`:
- Puerto por defecto: 3200
- Canal por defecto: `queue-channel`

## 🎯 Uso

1. **Iniciar el servidor**: Ejecuta `bun run dev` o `bun run start`
2. **Acceder al cliente**: Abre `http://localhost:3200` en tu navegador
3. **Crear tickets**: Usa la interfaz web para crear tickets normales o preferenciales
4. **Gestionar cola**: Solicita el siguiente ticket desde cualquier escritorio

## 🏗️ Arquitectura

### Flujo de Datos
1. **Cliente** → Envía mensaje WebSocket
2. **Servidor** → Recibe y procesa mediante `message.handler.ts`
3. **Servicio** → Aplica lógica de negocio en `ticket-queue.service.ts`
4. **Store** → Actualiza estado en `ticket-queue.store.ts`
5. **Broadcast** → Envía actualizaciones a todos los clientes conectados

### Componentes Principales
- **TicketQueueStore**: Gestiona el estado de la cola
- **TicketQueueService**: Contiene la lógica de negocio
- **MessageHandler**: Procesa mensajes WebSocket
- **Server**: Configuración y manejo de conexiones WebSocket

## 🧪 Tecnologías

- **Bun**: Runtime JavaScript de alto rendimiento
- **TypeScript**: Superset tipado de JavaScript
- **WebSockets**: Comunicación bidireccional en tiempo real
- **Zod**: Validación de esquemas de datos
- **HTML/CSS/JavaScript**: Interfaz web del cliente

## 📝 Desarrollo

### Agregar Nuevos Tipos de Mensajes
1. Define el tipo en `src/types/index.ts`
2. Agrega el manejador en `src/handlers/message.handler.ts`
3. Actualiza el servicio si es necesario

### Extender la Lógica de Negocio
1. Modifica `src/services/ticket-queue.service.ts`
2. Actualiza los tipos en `src/types/` si es necesario
3. Prueba con el cliente web

## 🤝 Contribuir

1. Fork del proyecto
2. Crear rama de características: `git checkout -b feature/nueva-funcionalidad`
3. Commit de cambios: `git commit -am 'Agregar nueva funcionalidad'`
4. Push a la rama: `git push origin feature/nueva-funcionalidad`
5. Submit Pull Request

## 📄 Licencia

Este proyecto fue creado usando `bun init` en bun v1.3.13. [Bun](https://bun.com) es un runtime JavaScript rápido y todo en uno.
