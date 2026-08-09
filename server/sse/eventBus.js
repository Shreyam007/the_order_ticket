import { EventEmitter } from 'events';

class SSEEventBus extends EventEmitter {
  constructor() {
    super();
    // Map of userId -> Set of express response objects
    this.clients = new Map();
  }

  addClient(userId, res) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId).add(res);

    res.on('close', () => {
      this.removeClient(userId, res);
    });
  }

  removeClient(userId, res) {
    if (this.clients.has(userId)) {
      const userClients = this.clients.get(userId);
      userClients.delete(res);
      if (userClients.size === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Broadcast an event to target user IDs or all users if targetUserIds is null/undefined
   * @param {string} eventName 
   * @param {object} payload 
   * @param {string|string[]|null} targetUserIds 
   */
  emitEvent(eventName, payload, targetUserIds = null) {
    const formattedData = `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;

    if (!targetUserIds) {
      // Broadcast to all
      for (const [userId, userClients] of this.clients.entries()) {
        for (const res of userClients) {
          res.write(formattedData);
        }
      }
      return;
    }

    const ids = Array.isArray(targetUserIds) ? targetUserIds : [targetUserIds];
    ids.forEach((id) => {
      const idStr = id.toString();
      if (this.clients.has(idStr)) {
        for (const res of this.clients.get(idStr)) {
          res.write(formattedData);
        }
      }
    });
  }
}

export const eventBus = new SSEEventBus();
