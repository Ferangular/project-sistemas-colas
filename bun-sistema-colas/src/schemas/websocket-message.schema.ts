/**
 * =============================================================================
 * WEBSOCKET MESSAGE SCHEMA - CAPA DE VALIDACIÓN (SCHEMA)
 * =============================================================================
 * 
 * PROPÓSITO:
 * Este archivo define los esquemas de validación para todos los mensajes que
 * se intercambian a través de WebSockets. Utiliza Zod para proporcionar validación
 * de tipos en tiempo de ejecución y autogeneración de tipos TypeScript.
 * 
 * RESPONSABILIDADES:
 * - Definir la estructura exacta de los mensajes del cliente
 * - Validar automáticamente los datos entrantes
 * - Proporcionar autocompletado y seguridad de tipos
 * - Prevenir errores de formato en los mensajes
 * - Documentar la API de mensajes WebSocket
 * 
 * PATRÓN DE DISEÑO:
 * - Schema Validation Pattern: Centraliza la validación de datos
 * - Discriminated Union: Permite validar diferentes tipos de mensajes
 * - Type-Safe: Genera tipos TypeScript automáticamente desde los esquemas
 * - Defensive Programming: Protege contra datos malformados
 * 
 * RELACIÓN CON OTRAS CAPAS:
 * - Handlers: Utilizan estos esquemas para validar mensajes entrantes
 * - Types: Los tipos generados complementan los tipos manuales
 * - Clientes: Sirven como documentación para desarrolladores de clientes
 * 
 * BENEFICIOS:
 * - Seguridad: Previene errores por datos incorrectos
 * - Autodocumentación: Los esquemas documentan la API
 * - Autocompletado: IDE conoce la estructura de los mensajes
 * - Mantenimiento: Cambios en la estructura se reflejan automáticamente
 * - Debugging: Errores de validación son claros y específicos
 * 
 * TIPOS DE MENSAJES DEFINIDOS:
 * - GET_STATE: Solicitar estado actual de la cola
 * - CREATE_TICKET: Crear nuevo ticket (normal/preferencial)
 * - REQUEST_NEXT_TICKET: Solicitar siguiente ticket para un escritorio
 * - RESET_QUEUE: Reiniciar completamente la cola
 */

import { z } from 'zod';

export const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('GET_STATE'),
  }),

  z.object({
    type: z.literal('CREATE_TICKET'),
    payload: z.object({
      isPreferential: z.boolean('isPreferential is required'),
    }),
  }),

  z.object({
    type: z.literal('REQUEST_NEXT_TICKET'),
    payload: z.object({
      deskNumber: z.number('deskNumber is required').int().positive(),
      forceNormalTicket: z.boolean('forceNormalTicket is required'),
    }),
  }),

  z.object({
    type: z.literal('RESET_QUEUE'),
  }),
]);

export type MessageParsed = z.infer<typeof messageSchema>;
