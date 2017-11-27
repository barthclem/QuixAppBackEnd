import {QuestionStage} from '../quixMaster/QuestionStages';
import {Question} from './question';
import {QuestionTag} from './questionTag';
import {QuestioinTagImpl} from './QuestionTagImpl';
/**
 * Created by barthclem on 11/19/17.
 */
export  class QuixUtility {

    static stageExtractor ( questions: Question []): string [] {
        const questionStages = new Set<string>();
        questions.forEach((question) => {
            questionStages.add(question.category);
        });
        return Array.from(questionStages);
    }

    static questionClassifier ( stages: string [], questions: Question []): QuestionStage [] {
        const questionStages: QuestionStage [] = [];
        let index = 1;
        stages.forEach(stage => {
            const stageQuestions = questions.filter(question => question.category === stage);
            questionStages.push({
                index: index++,
                title: stage,
                numberOfEntries: stageQuestions.length,
                entries: stageQuestions
            });
        });
        return questionStages;
    }

    static questionTagExtractor ( questions: Question []): QuestionTag [] {
        const questionTags: QuestionTag [] = [];
        questions.forEach( question => {
            questionTags.push(new QuestioinTagImpl ( question.id, true));
        });
        return questionTags;
    }

    static numberOfRoundsCalc ( question: QuestionStage, noOfTeams: number): QuestionStage {
       question.numberOfRounds = Math.floor(question.numberOfEntries / noOfTeams);
       return question;
    }

    static arrangeStages ( questionStages: QuestionStage []) {
        return questionStages.sort((a, b) => a.index - b.index);
    }

}
