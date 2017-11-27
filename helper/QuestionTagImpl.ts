import {QuestionTag} from './questionTag';
/**
 * Created by barthclem on 11/13/17.
 */
export class QuestioinTagImpl implements QuestionTag {

  public constructor(private _questionNumber: number, private _available: boolean ) {

  }

  get available(): boolean {
    return this._available;
  }

  set available(value: boolean) {
    this._available = value;
  }
  get questionNumber(): number {
    return this._questionNumber;
  }

  set questionNumber(value: number) {
    this._questionNumber = value;
  }
}
