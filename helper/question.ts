import {QuestionType} from './QuestionType';
/**
 * Created by barthclem on 11/13/17.
 */
export interface Question {
  id: number;
  type: QuestionType;
  category: string;
  questionText: string;
  img?: string;
  options: string [];
  answer?: string;
}

