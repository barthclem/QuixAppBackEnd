import {QuestionPicked} from '../eventsInterfaces/QuestionPicked';
import {AmeboEvent} from '../events/AmeboEvent';
import {QuestionAttempted} from '../eventsInterfaces/QuestionAttempted';
/**
 * Created by barthclem on 11/20/17.
 */
export class QuizParams {

    private _questionPicked: AmeboEvent;
    private _questionAttempted: AmeboEvent;
    private _bonusAttempted: AmeboEvent;

    constructor() {
        this._questionPicked = new AmeboEvent<number>();
        this._bonusAttempted = new AmeboEvent<string>();
        this._questionAttempted = new AmeboEvent<QuestionAttempted>();
    }

    get questionPicked(): AmeboEvent {
        return this._questionPicked;
    }

    set questionPicked(value: number) {
        this._questionPicked.value = value;
    }

    get bonusAttempted(): AmeboEvent {
        return this._bonusAttempted;
    }

    set bonusAttempted(value: string) {
        this._bonusAttempted.value = value;
    }
    get questionAttempted(): AmeboEvent {
        return this._questionAttempted;
    }

    set questionAttempted(value: QuestionAttempted) {
        this._questionAttempted.value = value;
    }


}
