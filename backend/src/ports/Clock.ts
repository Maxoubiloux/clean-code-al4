export interface Clock {
    now(): Date;
}

export class SystemClock implements Clock {
    now(): Date {
        return new Date();
    }
}

export class FakeClock implements Clock {
    constructor(private fixedDate: Date) { }

    now(): Date {
        return this.fixedDate;
    }

    setDate(date: Date): void {
        this.fixedDate = date;
    }
}
