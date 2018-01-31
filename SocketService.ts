import {NavEventRegistry, QuizEventRegistry} from './helper/EventRegistry';
import {Question} from './helper/question';
import {QuestionTag} from './helper/questionTag';
import {Team} from './helper/Team';
/**
 * Created by barthclem on 11/19/17.
 */
export class SocketService {
    constructor(private io: any) {
    }

    /**
     * @name broadcastNewCategory
     * @description - this runs at the beginning of a new category.
     * @param stageName {string} - this is the name of the new category
     * @param numberOfRound {number} - this is the number of rounds in the new category
     * @param teams {string[]} - this gives the names of qualified teams for the new category
     * @returns void
     */
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

    /**
     * @name broadcastEndOfCategory
     * @description - this method is responsible for sending end of a category to all participants of  quiz.
     * @param stageName {string} - the name of the just concluded category [stageName]
     * @return {void}
     */
    broadcastEndOfCategory(stageName: string): void {
        console.log(`Broadcast End of Category`);
        this.io.emit('response', {
            type: QuizEventRegistry.END_OF_CATEGORY,
            error: false,
            data: {
                stageName :  stageName
                }
        });
    }

    /**
     * @name broadcastEndOfCompetition
     * @description - this sends a broadcast to client informing them of the end of the quiz competition.
     */
    broadcastEndOfCompetition(): void {
        console.log(`Broadcast end of all Categories`);
        this.io.emit('response', {
            type: QuizEventRegistry.END_OF_QUIZ_EVENT,
            error: false,
            data: {
                message :  'congratulations you made it to the final'
            }
        });
    }

    /**
     * @name - selectQuestionBroadcast
     * @description - This method sends broadcast message to all teams informing them about the
     * -team to select question
     * @param team {string} - the name of team to choose a question
     * @param questionTags {Question []} - the list of available Question Tags
     * @returns void
     */
    selectQuestionBroadcast( team: string, questionTags: QuestionTag [] ) {
        const tags = questionTags.map(queTag =>
        { return { questionNumber: queTag.questionNumber, available: queTag.available }; });
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


    /**
     * @name SendQuestionBroadcast
     * @description - this sends a broadcast of the question selected together with the name of team to answer it
     * - to all conneted socket
     * @param question {Question} - this is the object containing the question to be answered and its option
     * @param teamName {string} - this is the name of the teamName to answer selected question
     * @param currentRound {number} - this indicate the current round in a stage of the competition
     * @returns void
     */
    sendQuestionBroadcast ( question: Question, teamName: string, currentRound: number ): void {
        this.io.emit('response', {
            type: QuizEventRegistry.QUESTION_LOADED_EVENT,
            error: false,
            data: {
                question :  question,
                teamName: teamName,
                currentRound: currentRound
            }
        });
    }

    /**
     * @name BroadCastSelectAnswer
     * @description - this is the function responsible of broadcasting the answer selected by a socket
     * - to all connected sockets (users/ Teams)
     * @param selectedOption  {string}- the option of question selected by the user/team
     * @param selectedOptionIndex {number}- this is the index of the selected option
     * @param teamName {string}- this is the teamName of the user that selected an option
     * @param isCorrect {boolean}- this gives the correctness of the option selected
     * @return void
     */
    broadcastSelectedAnswer (selectedOption: string, selectedOptionIndex: number, teamName: string, isCorrect: boolean) {
        console.log(`Broadcast answer to all guys in the block`);
        this.io.emit('response', {
            type: QuizEventRegistry.ANSWERED_LOADED_EVENT,
            error: false,
            data: {
                selectedOption: selectedOption,
                selectedOptionIndex: selectedOptionIndex,
                teamName: teamName,
                isCorrect: isCorrect
            }
        });
    }

    /**
     * @name SendBonusBroadcast
     * @description - this function is fired when the current team misses a question
     * - it gives the next team in the list the opportunity to get bonus mark
     * @param team {string} - name of the team that has bonus question
     * @return void
     */
    sendBonusBroadcast ( team: string ) {
        console.log(`Start the bonus session ASAP`);
        this.io.emit('response', {
            type: QuizEventRegistry.BONUS_LOADED_EVENT,
            error: false,
            data: {
                teamName: team
            }
        });
    }

    /**
     * @name broadcastTeamScoreUpdate
     * @description - this function is fired after a team has attempted a question/correct
     * @param teams {Team []} - the list of updated teams
     * @returns void
     */
    broadcastTeamScoreUpdate ( teams: Team [] ) {
        const teamz = teams.map( t => { const teem = {
            name: t.name,
            members: [],
            teamStatus: t.teamStatus,
            scores: [],
            totalScore: t.totalScore,
            position: t.position,
            qualified: t.qualified
        }; return teem; });

        console.log(`Send updated Team objects to all connected teams : ${JSON.stringify(teamz)}`);
        this.io.emit('response', {
            type: NavEventRegistry.UPDATE_SCORE,
            error: false,
            data: {
                teams: teamz
            }
        });
    }
}
