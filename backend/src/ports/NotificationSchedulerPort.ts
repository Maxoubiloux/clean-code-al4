export interface NotificationSchedulerPort {
    scheduleNotification(date: Date, message: string): Promise<void>;
}
