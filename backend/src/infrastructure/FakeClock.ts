import { Clock } from '../ports/Clock';

export class FakeClock implements Clock {
    constructor(private fixedDate: Date) { }

    now(): Date {
        return this.fixedDate;
    }

    setDate(date: Date): void {
        this.fixedDate = date;
    }
}
