/**
 * Created by barthclem on 11/16/17.
 */
export class TimerManager {

    private remainingDuration: number;
    private timer: any;
    private _timerStoppedRemotely: boolean;

    constructor(private countDownTime: number) {
        this.remainingDuration = countDownTime;
    }

    startTimer (sendTimeFunc: Function) {
        this.timer = setInterval(() => {
            sendTimeFunc(this.countDownTime);
            this.doCountDown();
        }, 1000);
    }

    doCountDown() {
        this.countDownTime--;
        if (this.countDownTime <= 0) {
            this.countDownTime = 0;
            console.log(`The timer should be stopped`);
           this.stopTimer();
        }
    }

    getRemaningTime () {
        return this.countDownTime;
    }

    stopTimer () {
        clearInterval(this.timer);
        this.timerStoppedRemotely = true;
    }

    timerStarted (): boolean {
       return this.remainingDuration !== this.countDownTime;
    }

    timerActive (): boolean {
        return this.countDownTime > 0 && this.timerStarted();
    }
    get timerStoppedRemotely(): boolean {
        return this._timerStoppedRemotely;
    }

    set timerStoppedRemotely(value: boolean) {
        this._timerStoppedRemotely = value;
    }
}
