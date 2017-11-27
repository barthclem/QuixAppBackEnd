import {Question} from './question';
import {QuestionTag} from './questionTag';
/**
 * Created by barthclem on 11/16/17.
 */
export class QuestionTagExtractor {
    private cQuestions: Question [];

    constructor(private questions: Question []) {
        this.cQuestions = questions.slice(0, questions.length);
    }

    extract (): QuestionTag [] {
        return this.cQuestions.map( question => {
            return {questionNumber: question.id, available: true};
});
    }
}
