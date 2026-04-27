/**
 * =============================================================================
 * TICKET QUEUE STORE - CAPA DE DATOS (STORE)
 * =============================================================================
 * 
 * PROPÓSITO:
 * Este archivo implementa el patrón Store para gestionar el estado centralizado
 * de la cola de tickets. Es la capa más baja de la arquitectura, responsable
 * de mantener y manipular los datos en memoria.
 * 
 * RESPONSABILIDADES:
 * - Almacenar el estado completo de la cola (tickets pendientes, activos, servidos)
 * - Gestionar la creación de nuevos tickets con numeración automática
 * - Controlar la asignación de tickets a escritorios
 * - Mantener el historial de tickets recientemente atendidos
 * - Proporcionar métodos para resetear el estado completo
 * 
 * PATRÓN DE DISEÑO:
 * - Store Pattern: Centraliza el estado en una sola clase
 * - Inmutabilidad: Los métodos modifican el estado interno pero devuelven
 *   resultados predecibles
 * - Encapsulación: El estado es privado y solo se puede modificar a través
 *   de los métodos públicos
 * 
 * RELACIÓN CON OTRAS CAPAS:
 * - Services: Utilizan este store para operaciones de negocio
 * - Handlers: No interactúan directamente con el store, usan services
 * - Types: Utiliza los tipos definidos para mantener consistencia
 */

import type { QueueMessageState } from '../types/queue-message-state';
import type { Ticket, TicketPrefix } from '../types/ticket';
import { formatTicketId } from '../utils/format-ticket-id';

const DEFAULT_RECENTLY_SERVE_LIMIT = 8;

interface QueueStoreState {
  lastTicketNumbers: {
    A: number;
    P: number;
  };
  pending: {
    normal: Ticket[];
    preferential: Ticket[];
  };

  activeByDesk: Record<number, Ticket | undefined>;
  recentlyServed: Ticket[];
}

export class TicketQueueStore {
  private state: QueueStoreState = {
    activeByDesk: {},
    lastTicketNumbers: { A: 0, P: 0 },
    pending: {
      normal: [],
      preferential: [],
    },
    recentlyServed: [],
  };

  getState(): QueueMessageState {
    return {
      activeByDesk: this.state.activeByDesk,
      lastTicketNumbers: this.state.lastTicketNumbers,
      pendingTotal: {
        normal: this.state.pending.normal.length,
        preferential: this.state.pending.preferential.length,
        combined:
          this.state.pending.normal.length +
          this.state.pending.preferential.length,
      },
      recentlyServed: this.state.recentlyServed,
    };
  }

  reset() {
    this.state = {
      activeByDesk: {},
      lastTicketNumbers: { A: 0, P: 0 },
      pending: {
        normal: [],
        preferential: [],
      },
      recentlyServed: [],
    };
  }

  createTicket(prefix: TicketPrefix): Ticket {
    const validPrefixes = ['A', 'P'];
    if (!validPrefixes.includes(prefix)) {
      throw new Error(
        `Invalid prefix: ${prefix}. Must be ${validPrefixes.join('m, ')}`
      );
    }

    let currentNumber = this.state.lastTicketNumbers[prefix] ?? 0;
    if (currentNumber >= 999) {
      currentNumber = 0;
    }

    const nextNumber = currentNumber + 1;
    this.state.lastTicketNumbers[prefix] = nextNumber;

    const ticket: Ticket = {
      id: formatTicketId(prefix, nextNumber), // A-001
      prefix: prefix,
      number: nextNumber,
      deskNumber: undefined,
      createdAt: Date.now(),
      servedAt: undefined,
    };

    if (prefix === 'P') {
      this.state.pending.preferential.push(ticket);
    } else {
      this.state.pending.normal.push(ticket);
    }

    return ticket;
  }

  assignNextTicket(deskNumber: number, forceNormalTicket: boolean) {
    let ticket: Ticket | undefined = undefined;

    if (forceNormalTicket) {
      ticket = this.state.pending.normal.shift();
    }

    if (!ticket) {
      ticket = this.state.pending.preferential.shift();
    }

    if (!ticket) {
      ticket = this.state.pending.normal.shift();
    }

    if (!ticket) {
      return undefined;
    }

    ticket.deskNumber = deskNumber;
    ticket.servedAt = Date.now();

    this.state.activeByDesk[deskNumber] = ticket;
    this.pushRecentlyServed(ticket);

    return ticket;
  }

  private pushRecentlyServed(ticket: Ticket): void {
    this.state.recentlyServed.unshift(ticket);

    if (this.state.recentlyServed.length > DEFAULT_RECENTLY_SERVE_LIMIT) {
      this.state.recentlyServed = this.state.recentlyServed.slice(
        0,
        DEFAULT_RECENTLY_SERVE_LIMIT
      );
    }
  }
}
