import {Question} from './question';
/**
 * Created by barthclem on 11/13/17.
 */
export class QuestionImpl implements Question {

  category: string;
  questionText: string;
  options: string[];

  constructor(private _id: number, private _type: number, private _title: string,
  private _img: string, private _answers: string []) {

  }

  get answers(): string[] {
    return this._answers;
  }

  set answers(value: string[]) {
    this._answers = value;
  }
  get img(): string {
    return this._img;
  }

  set img(value: string) {
    this._img = value;
  }
  get title(): string {
    return this._title;
  }

  set title(value: string) {
    this._title = value;
  }
  get type(): number {
    return this._type;
  }

  set type(value: number) {
    this._type = value;
  }
  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }
}
