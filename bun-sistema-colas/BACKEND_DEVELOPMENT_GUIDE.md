# 🏗️ Guía de Desarrollo Backend - Ruta Lógica de Creación

## 📋 Introducción

Esta guía establece el orden lógico y recomendado para crear un proyecto backend desde cero, siguiendo las mejores prácticas de arquitectura y patrones de diseño. Se basa en la estructura del sistema de colas que hemos analizado.

## 🎯 Filosofía de Desarrollo

**"De lo más simple a lo más complejo, de lo más estable a lo más volátil"**

El desarrollo debe seguir un orden que minimice el riesgo y maximice la estabilidad:
1. **Datos primero**: La estructura de datos es la base más estable
2. **Validación luego**: Proteger los datos es fundamental
3. **Lógica después**: Las reglas de negocio dependen de los datos
4. **Presentación finalmente**: La interfaz cambia con más frecuencia

---

## 🛣️ Ruta de Desarrollo (Orden Lógico)

### 📊 **PASO 1: Definición de Tipos y Estructuras de Datos**
**Directorio**: `src/types/`

**¿Por qué primero?**
- Los tipos son la base de toda la aplicación
- Son la parte más estable del sistema
- Definen el contrato entre todas las capas

**Qué crear:**
```typescript
// types/index.ts - Tipos principales de la aplicación
// types/ticket.ts - Entidades de negocio
// types/queue-message-state.ts - Estados de la aplicación
```

**Ejemplo de desarrollo:**
```typescript
// 1. Definir entidades básicas
export interface Ticket {
  id: string;
  prefix: 'A' | 'P';
  number: number;
  // ...
}

// 2. Definir estados de la aplicación
export interface QueueMessageState {
  pendingTotal: { normal: number; preferential: number; combined: number };
  // ...
}

// 3. Definir contratos de comunicación
export type ClientMessage = { type: 'CREATE_TICKET'; payload: {...} } | ...
```

---

### 🔍 **PASO 2: Esquemas de Validación**
**Directorio**: `src/schemas/`

**¿Por qué segundo?**
- Protege la integridad de los datos desde el inicio
- Define las reglas de entrada de forma explícita
- Facilita el testing temprano

**Qué crear:**
```typescript
// schemas/websocket-message.schema.ts - Validación de mensajes
// schemas/ticket.schema.ts - Validación de entidades
```

**Ejemplo de desarrollo:**
```typescript
// 1. Validar entrada de datos
export const messageSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('CREATE_TICKET'), payload: {...} }),
  // ...
]);

// 2. Generar tipos automáticamente
export type MessageParsed = z.infer<typeof messageSchema>;
```

---

### 🗄️ **PASO 3: Capa de Datos (Store)**
**Directorio**: `src/store/`

**¿Por qué tercero?**
- Gestiona el estado centralizado
- Es la base sobre la que se construye la lógica
- Independiente de la lógica de negocio

**Qué crear:**
```typescript
// store/ticket-queue.store.ts - Gestión del estado
```

**Ejemplo de desarrollo:**
```typescript
// 1. Definir estado interno
interface QueueStoreState {
  pending: { normal: Ticket[]; preferential: Ticket[] };
  // ...
}

// 2. Implementar operaciones básicas
export class TicketQueueStore {
  createTicket(prefix: TicketPrefix): Ticket { /* ... */ }
  assignNextTicket(deskNumber: number): Ticket | undefined { /* ... */ }
}
```

---

### ⚙️ **PASO 4: Capa de Lógica de Negocio (Services)**
**Directorio**: `src/services/`

**¿Por qué cuarto?**
- Orquesta las operaciones del store
- Aplica reglas de negocio complejas
- Abstrae la complejidad del store

**Qué crear:**
```typescript
// services/ticket-queue.service.ts - Lógica de negocio
```

**Ejemplo de desarrollo:**
```typescript
// 1. Inyectar dependencias
class TicketQueueService {
  constructor(private store: TicketQueueStore) {}

  // 2. Implementar casos de uso
  createTicket(prefix: TicketPrefix): Ticket {
    // Lógica de negocio aquí
    return this.store.createTicket(prefix);
  }
}
```

---

### 🎯 **PASO 5: Utilidades y Helpers**
**Directorio**: `src/utils/`

**¿Por qué en paralelo con los servicios?**
- Son funciones reutilizables
- Apoyan a todas las capas
- Mantienen el código DRY

**Qué crear:**
```typescript
// utils/generate-uuid.ts - Generación de IDs
// utils/format-ticket-id.ts - Formateo de datos
```

---

### 📡 **PASO 6: Manejadores de Eventos (Handlers)**
**Directorio**: `src/handlers/`

**¿Por qué sexto?**
- Conectan la capa de presentación con la lógica
- Dependen de todas las capas anteriores
- Son el punto de entrada de las operaciones

**Qué crear:**
```typescript
// handlers/message.handler.ts - Procesamiento de mensajes
```

**Ejemplo de desarrollo:**
```typescript
// 1. Validar entrada con schemas
// 2. Llamar a servicios
// 3. Formatear respuesta
export const handleMessage = (message: string): HandleResult => {
  const parsed = messageSchema.parse(JSON.parse(message));
  // Lógica de manejo aquí
};
```

---

### ⚙️ **PASO 7: Configuración**
**Directorio**: `src/config/`

**¿Por qué séptimo?**
- La configuración es estable pero puede cambiar
- Depende de las necesidades de las capas anteriores

**Qué crear:**
```typescript
// config/server-config.ts - Configuración del servidor
```

---

### 🌐 **PASO 8: Servidor y Conexiones**
**Directorio**: `src/`

**¿Por qué octavo?**
- Es la capa de infraestructura
- Orquesta todas las capas anteriores
- Es el punto de entrada final

**Qué crear:**
```typescript
// server.ts - Configuración del servidor WebSocket
// index.ts - Punto de entrada principal
```

---

### 🎨 **PASO 9: Interfaz de Cliente (Opcional)**
**Directorio**: `public/`

**¿Por qué último?**
- Es la capa más volátil
- Depende completamente del backend
- Puede ser reemplazada fácilmente

---

## 🔄 Flujo de Trabajo Recomendado

### 📋 **Fase de Planificación**
1. **Definir entidades**: ¿Qué datos maneja el sistema?
2. **Definir casos de uso**: ¿Qué operaciones se pueden realizar?
3. **Definir contratos**: ¿Cómo se comunican los componentes?

### 🏗️ **Fase de Desarrollo**
1. **Tipos** → **Schemas** → **Store** → **Services** → **Handlers** → **Server**
2. **Testing unitario** después de cada capa
3. **Testing de integración** al final

### 🧪 **Fase de Validación**
1. **Unit tests**: Cada capa de forma aislada
2. **Integration tests**: Comunicación entre capas
3. **E2E tests**: Flujo completo de la aplicación

---

## 🎯 Principios Clave

### **Single Responsibility Principle**
- Cada archivo tiene una responsabilidad clara
- Cada capa tiene un propósito específico

### **Dependency Inversion**
- Las capas superiores dependen de abstracciones
- Las capas inferiores implementan las abstracciones

### **Separation of Concerns**
- Datos separados de la lógica
- Lógica separada de la presentación
- Validación separada del negocio

### **Testability**
- Cada capa puede ser probada independientemente
- Las dependencias pueden ser mockeadas

---

## 🚀 Beneficios de Este Orden

1. **Estabilidad**: Las capas base cambian menos
2. **Testabilidad**: Cada capa puede ser probada unitariamente
3. **Mantenibilidad**: Los cambios están localizados
4. **Escalabilidad**: Las capas pueden evolucionar independientemente
5. **Colaboración**: Diferentes desarrolladores pueden trabajar en capas distintas

---

## 🛠️ Herramientas Recomendadas

### **Para Tipos**: TypeScript
- Tipado fuerte
- Autocompletado
- Refactoring seguro

### **Para Validación**: Zod
- Validación en runtime
- Generación automática de tipos
- Mensajes de error claros

### **Para Testing**: Jest/Bun Test
- Testing unitario
- Mocking de dependencias
- Coverage de código

---

## 📝 Checklist de Desarrollo

### **Antes de Empezar**
- [ ] Definir entidades y relaciones
- [ ] Definir casos de uso principales
- [ ] Definir contratos de comunicación

### **Durante el Desarrollo**
- [ ] Crear tipos antes que implementación
- [ ] Validar datos antes de procesarlos
- [ ] Testear cada capa unitariamente
- [ ] Documentar interfaces públicas

### **Al Finalizar**
- [ ] Testing de integración completo
- [ ] Documentación de API
- [ ] Revisión de arquitectura
- [ ] Optimización de rendimiento

---

## 🎓 Conclusión

Seguir este orden lógico garantiza:
- **Código mantenible**: Cada cambio tiene impacto predecible
- **Arquitectura sólida**: Las capas tienen responsabilidades claras
- **Desarrollo eficiente**: Los problemas se detectan temprano
- **Calidad alta**: Cada capa está probada y validada

Esta guía puede adaptarse a diferentes tipos de proyectos backend, pero los principios fundamentales permanecen: **datos → validación → lógica → presentación**.
