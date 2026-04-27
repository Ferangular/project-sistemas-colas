/**
 * =============================================================================
 * TICKET QUEUE SERVICE - CAPA DE LÓGICA DE NEGOCIO (SERVICE)
 * =============================================================================
 * 
 * PROPÓSITO:
 * Este archivo implementa la capa de servicios que contiene la lógica de negocio
 * del sistema de colas. Actúa como intermediario entre los handlers (capa de 
 * presentación) y el store (capa de datos), aplicando reglas de negocio y 
 * coordinando operaciones complejas.
 * 
 * RESPONSABILIDADES:
 * - Orquestar las operaciones de la cola de tickets
 * - Aplicar reglas de negocio (prioridades, validaciones)
 * - Proporcionar una interfaz limpia para las operaciones de cola
 * - Gestionar el ciclo de vida de los tickets
 * - Abstraer la complejidad del store de las capas superiores
 * 
 * PATRÓN DE DISEÑO:
 * - Service Layer Pattern: Aisla la lógica de negocio del resto de la aplicación
 * - Dependency Injection: Recibe el store como dependencia
 * - Facade Pattern: Proporciona una interfaz simplificada al store
 * - Singleton Pattern: Se exporta una única instancia para mantener consistencia
 * 
 * RELACIÓN CON OTRAS CAPAS:
 * - Store: Utiliza el store para persistir y recuperar datos
 * - Handlers: Los handlers consumen este servicio para ejecutar operaciones
 * - Types: Utiliza los tipos definidos para mantener consistencia en la interfaz
 * 
 * BENEFICIOS:
 * - Testabilidad: La lógica está aislada y puede ser probada unitariamente
 * - Mantenibilidad: Los cambios en la lógica de negocio están centralizados
 * - Reutilización: El mismo servicio puede ser consumido por diferentes handlers
 * - Separación de responsabilidades: Cada capa tiene un propósito claro
 */

import { TicketQueueStore } from '../store/ticket-queue.store';
import type { QueueMessageState } from '../types/queue-message-state';
import type { Ticket, TicketPrefix } from '../types/ticket';

class TicketQueueService {
  private readonly store: TicketQueueStore;

  constructor() {
    this.store = new TicketQueueStore();
  }

  createTicket(prefix: TicketPrefix): Ticket {
    return this.store.createTicket(prefix);
  }

  assignNextTicket(
    deskNumber: number,
    forceNormalTicket: boolean
  ): Ticket | undefined {
    return this.store.assignNextTicket(deskNumber, forceNormalTicket);
  }

  reset(): void {
    this.store.reset();
  }

  getState(): QueueMessageState {
    return this.store.getState();
  }
}

export const ticketQueueService = new TicketQueueService();
