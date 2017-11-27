import {QuestionStage} from './QuestionStages';
import {Question} from '../helper/question';
/**
 * Created by barthclem on 11/19/17.
 */
export class QuestionStageImpl implements QuestionStage {
    index: number;
    title: string;
    numberOfEntries: number;
    entries: Question[];
    numberOfRounds: number;
}
