import {Team} from './helper/Team';
import {QuizEventRegistry} from './helper/EventRegistry';
import {Question} from './helper/question';
import {QuestionTag} from './helper/questionTag';
/**
 * Created by barthclem on 11/19/17.
 */
export class SocketService {
    constructor(private io: any) {

    }

    broadcastNewCategory(stageName: string, numberOfRound: number, teams: string []) {
        console.log(`Broadcast New Category done`);
        this.io.emit('response', {
            type: QuizEventRegistry.START_OF_NEW_CATEGORY,
            error: false,
            data: {
                stageName :  stageName,
                noOfRounds: numberOfRound,
                teams: teams
            }
        });

    }
    /*
    This method sends broadcast message to all teams informing them about the
    team to select question
     */
    selectQuestionBroadcast( team: string, questionTags: QuestionTag [] ) {
        const tags = questionTags.map(queTag => { return { questionNumber: queTag.questionNumber, available: queTag.available }; });
        setTimeout(() => {
            this.io.emit('response', {
                type: QuizEventRegistry.USER_TURN_TO_PICK_QUESTION_EVENT,
                error: false,
                data: {
                    team :  team,
                    questionTags: tags
                }
            });
            console.log(` User is to pick is fired :=: ${team}`);
        }, 4000);
        console.log(` Question Broadcast Question Tag-> ${JSON.stringify(tags)}`);
    }


    sendQuestionBroadcast ( question: Question, teamName: string ): void {
        this.io.emit('response', {
            type: QuizEventRegistry.QUESTION_LOADED_EVENT,
            error: false,
            data: {
                question :  question,
                teamName: teamName
            }
        });
    }

    broadcastSelectedAnswer (selectedOption: string, teamName: string, isCorrect: boolean) {
        this.io.emit('response', {
            type: QuizEventRegistry.ANSWERED_LOADED_EVENT,
            error: false,
            data: {
                selectedOption: selectedOption,
                teamName: teamName,
                isCorrect: isCorrect
            }
        });
    }

    sendBonusBroadcast ( nextTeam: string ) {
        this.io.emit('response', {
            type: QuizEventRegistry.BONUS_LOADED_EVENT,
            error: false,
            data: {
                teamName: nextTeam
            }
        });
    }
}