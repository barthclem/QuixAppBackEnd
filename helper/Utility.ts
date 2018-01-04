import {QuestionStage} from '../quixMaster/QuestionStages';
import {Question} from './question';
import {QuestionTag} from './questionTag';
import {QuestioinTagImpl} from './QuestionTagImpl';
import {Team} from './Team';
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
                entries: stageQuestions,
                numberOfRounds: 0
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

    static numberOfRoundsCalc ( question: QuestionStage, noOfTeams: number, maxNumOfRounds: number): QuestionStage {
        const numberOfRounds =  Math.floor(question.numberOfEntries / noOfTeams);
       question.numberOfRounds = numberOfRounds > maxNumOfRounds ? maxNumOfRounds : numberOfRounds;
       return question;
    }

    static arrangeStages ( questionStages: QuestionStage []) {
        return questionStages.sort((a, b) => a.index - b.index);
    }

    static sortTeamsBasedOnPosition (teams: Team []) {
        return teams.sort((teamA , teamB) => {
            const teamATotalTime = teamA.scores.length > 1 ? teamA.scores.map((score) => score.duration).reduce((a, b) => a + b)
                : teamA.scores[0] ? teamA.scores[0].duration : 0;
            const teamBTotalTime = teamB.scores.length > 1 ? teamB.scores.map((score) => score.duration).reduce((a, b) => a + b)
                : teamB.scores[0] ? teamB.scores[0].duration : 1;
            return teamB.totalScore - teamA.totalScore !== 0 ? teamB.totalScore - teamA.totalScore : teamBTotalTime - teamATotalTime;
        });
    }

}
