import {AmeboEvent} from '../events/AmeboEvent';
import {QuestionAttempted} from '../eventsInterfaces/QuestionAttempted';
/**
 * Created by barthclem on 11/20/17.
 */
export class QuizParams {

    private _questionPickedEvent: AmeboEvent<number>;
    private _questionAttempted: AmeboEvent<QuestionAttempted>;
    private _bonusAttempted: AmeboEvent<QuestionAttempted>;

    constructor() {
        this._questionPickedEvent = new AmeboEvent<number>();
        this._bonusAttempted = new AmeboEvent<QuestionAttempted>();
        this._questionAttempted = new AmeboEvent<QuestionAttempted>();
    }

    questionPickedEvent(): AmeboEvent<number> {
        return this._questionPickedEvent;
    }

    fireQuestionPickedEvent(value: number) {
        this._questionPickedEvent.value = value;
    }

    bonusAttemptedEvent(): AmeboEvent<QuestionAttempted> {
        return this._bonusAttempted;
    }

    fireBonusAttemptedEvent(value: QuestionAttempted) {
        this._bonusAttempted.value = value;
    }

    questionAttemptedEvent(): AmeboEvent<QuestionAttempted> {
        return this._questionAttempted;
    }

    fireQuestionAttemptedEvent(value: QuestionAttempted) {
        this._questionAttempted.value = value;
    }


}
