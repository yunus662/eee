// notifications.js

// A class representing a single notification.
class Notification {
  constructor(message, type = 'info', duration = 5000, importance = 1) {
    this.id = Date.now() + Math.random(); // unique identifier
    this.message = message;
    this.type = type; // types: 'info', 'success', 'warning', 'error'
    this.duration = duration; // how long the notification lasts (ms)
    this.importance = importance; // a factor to influence display priority
    this.timestamp = Date.now(); // time of creation
  }
}

// The NotificationManager handles creating, sorting, and displaying notifications.
export class NotificationManager {
  constructor(containerId = 'notification-area') {
    this.containerId = containerId;
    this.notifications = [];
    this.container = document.getElementById(containerId);
    if (!this.container) {
      // Create the container element if it doesn't exist.
      this.container = document.createElement('div');
      this.container.id = containerId;
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
    }
  }

  // Priority is calculated so that higher importance and newer notifications appear more prominently.
  calculatePriority(notification) {
    const age = Date.now() - notification.timestamp;
    return notification.importance * 10000 - age;
  }

  // Add a new notification.
  addNotification(message, options = {}) {
    const { type = 'info', duration = 5000, importance = 1 } = options;
    const notification = new Notification(message, type, duration, importance);
    this.notifications.push(notification);
    this.render();
    // Remove the notification automatically after its duration.
    setTimeout(() => {
      this.removeNotification(notification.id);
    }, duration);
  }

  // Remove a notification by its id.
  removeNotification(id) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.render();
  }

  // Render notifications in the container, sorted by their calculated priority.
  render() {
    // Sort the notifications by highest calculated priority
    this.notifications.sort(
      (a, b) => this.calculatePriority(b) - this.calculatePriority(a)
    );
    // Clear previous content.
    this.container.innerHTML = '';
    // Create and append each notification element.
    this.notifications.forEach((notif) => {
      const element = document.createElement('div');
      element.className = `notification ${notif.type}`;
      element.innerHTML = `<strong>${notif.type.toUpperCase()}</strong>: ${notif.message}`;
      this.container.appendChild(element);
    });
  }

  /**
   * Process a game action to trigger notifications based on how you act 
   * in the game. For instance, if you engage in combat or make significant decisions,
   * you can call this to spawn a context-sensitive message.
   */
  processGameAction(action) {
    // Example: if the action relates to an attack, generate a warning notification.
    if (action.type === 'attack') {
      const importance = action.payload && action.payload.severity ? action.payload.severity : 2;
      this.addNotification(`Warning: Hostile action detected!`, {
        type: 'warning',
        duration: 8000,
        importance,
      });
    }
    // You can add more action handlers here.
  }
}

// Create a singleton instance for application-wide use.
export const notificationManager = new NotificationManager();

// Helper function to log a notification event.
export function logEvent(message, options) {
  notificationManager.addNotification(message, options);
}
