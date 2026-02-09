export class NotificationService {
  static async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  static async showNotification(title: string, options?: NotificationOptions): Promise<void> {
    const hasPermission = await this.requestPermission();
    
    if (hasPermission) {
      new Notification(title, options);
    }
  }

  static scheduleHabitReminder(habitTitle: string, time: string): void {
    // This would integrate with a service worker for actual scheduling
    console.log(`Reminder scheduled for "${habitTitle}" at ${time}`);
  }
}