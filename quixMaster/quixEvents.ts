import {AmeboEvent} from '../events/AmeboEvent';
/**
 * Created by barthclem on 11/27/17.
 */
export class QuixEvents {

    private _startStageEvent: AmeboEvent;
    private _endStageEvent: AmeboEvent;
    private _startAllStagesEvent: AmeboEvent;
    private _endOfAllStagesEvent: AmeboEvent;
    private _startStageRounds: AmeboEvent;
    private _endOfStageRounds: AmeboEvent;
    private _endOfAllStageRounds: AmeboEvent;
    private _startRoundEvent: AmeboEvent;
    private _endOfRoundEvent: AmeboEvent;
    private _startTeamSession: AmeboEvent;
    private _endOfTeamSession: AmeboEvent;
    private _startTeamBonusSession: AmeboEvent;
    private _endOfTeamBonusSession: AmeboEvent;


    constructor() {
        this._startStageEvent = new AmeboEvent<number>();
        this._endStageEvent = new AmeboEvent<number>();
        this._startAllStagesEvent= new AmeboEvent<number>();
        this._endOfAllStagesEvent= new AmeboEvent<number>();
        this._startStageRounds= new AmeboEvent<number>();
        this._endOfStageRounds= new AmeboEvent<number>();
        this._endOfAllStageRounds= new AmeboEvent<number>();
        this._startRoundEvent= new AmeboEvent<number>();
        this._endOfRoundEvent= new AmeboEvent<number>();
        this._startTeamSession= new AmeboEvent<number>();
        this._endOfTeamSession= new AmeboEvent<number>();
        this._startTeamBonusSession= new AmeboEvent<number>();
        this._endOfTeamBonusSession= new AmeboEvent<number>();
    }

    get endOfTeamBonusSession(): AmeboEvent {
        return this._endOfTeamBonusSession;
    }

    set endOfTeamBonusSession(value: number) {
        this._endOfTeamBonusSession.value = value;
    }
    get startTeamBonusSession(): AmeboEvent {
        return this._startTeamBonusSession;
    }

    set startTeamBonusSession(value: number) {
        this._startTeamBonusSession.value = value;
    }

    get endOfTeamSession(): AmeboEvent {
        return this._endOfTeamSession;
    }

    set endOfTeamSession(value: number) {
        this._endOfTeamSession.value = value;
    }
    get startTeamSession(): AmeboEvent {
        return this._startTeamSession;
    }

    set startTeamSession(value: number) {
        this._startTeamSession.value = value;
    }



    get endOfRoundEvent(): AmeboEvent {
        return this._endOfRoundEvent;
    }

    set endOfRoundEvent(value: number) {
        this._endOfRoundEvent.value = value;
    }
    get startRoundEvent(): AmeboEvent {
        return this._startRoundEvent;
    }

    set startRoundEvent(value: number) {
        this._startRoundEvent.value = value;
    }

    get endOfAllStageRounds(): AmeboEvent {
        return this._endOfAllStageRounds;
    }

    set endOfAllStageRounds(value: number) {
        this._endOfAllStageRounds.value = value;
    }
    get endOfStageRounds(): AmeboEvent {
        return this._endOfStageRounds;
    }

    set endOfStageRounds(value: number) {
        this._endOfStageRounds.value = value;
    }
    get startStageRounds(): AmeboEvent {
        return this._startStageRounds;
    }

    set startStageRounds(value: number) {
        this._startStageRounds.value = value;
    }

    get startAllStagesEvent(): AmeboEvent {
        return this._startAllStagesEvent;
    }

    set startAllStagesEvent(value: number) {
        this._startAllStagesEvent.value = value;
    }

    get endOfAllStagesEvent(): AmeboEvent {
        return this._endOfAllStagesEvent;
    }

    set endOfAllStagesEvent(value: number) {
        this._endOfAllStagesEvent.value = value;
    }
    get endStageEvent(): AmeboEvent {
        return this._endStageEvent;
    }

    set endStageEvent(value: number) {
        this._endStageEvent.value = value;
    }
    get startStageEvent(): AmeboEvent {
        return this._startStageEvent;
    }

    set startStageEvent(value: number) {
        this._startStageEvent.value = value;
    }

}