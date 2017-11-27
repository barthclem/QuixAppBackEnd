import {AmeboEvent} from '../events/AmeboEvent';
import {QuestionAttempted} from '../eventsInterfaces/QuestionAttempted';
/**
 * Created by barthclem on 11/20/17.
 */
export class QuizParams {

    private _fireQuestionPickedEvent: AmeboEvent<number>;
    private _questionAttempted: AmeboEvent<QuestionAttempted>;
    private _bonusAttempted: AmeboEvent<string>;

    constructor() {
        this._fireQuestionPickedEvent = new AmeboEvent<number>();
        this._bonusAttempted = new AmeboEvent<string>();
        this._questionAttempted = new AmeboEvent<QuestionAttempted>();
    }

    questionPickedEvent(): AmeboEvent {
        return this._fireQuestionPickedEvent;
    }

    fireQuestionPickedEvent(value: number) {
        this._fireQuestionPickedEvent.value = value;
    }

    bonusAttemptedEvent(): AmeboEvent {
        return this._bonusAttempted;
    }

    fireBonusAttemptedEvent(value: string) {
        this._bonusAttempted.value = value;
    }

    questionAttemptedEvent(): AmeboEvent {
        return this._questionAttempted;
    }

    fireQuestionAttemptedEvent(value: QuestionAttempted) {
        this._questionAttempted.value = value;
    }


}
