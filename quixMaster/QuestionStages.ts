import {Question} from '../helper/question';
/**
 * Created by barthclem on 11/19/17.
 */
export interface QuestionStage {
    index: number;
    title: string;
    numberOfEntries: number;
    entries: Question [];
    numberOfRounds: number;
}
