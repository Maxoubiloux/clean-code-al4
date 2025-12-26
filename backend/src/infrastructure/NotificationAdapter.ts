import { NotificationSchedulerPort } from '../ports/NotificationSchedulerPort';

export class NotificationAdapter implements NotificationSchedulerPort {
    async scheduleNotification(date: Date, message: string): Promise<void> {
        console.log(`[NotificationAdapter] Scheduled notification for ${date.toISOString()}: ${message}`);
        // In a real implementation, this would connect to a queue or cron system.
    }
}
