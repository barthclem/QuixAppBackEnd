import {Team} from '../helper/Team';
import {Question} from '../helper/question';
import {SocketService} from '../SocketService';
import {QuizParams} from './QuixParams';
import {QuestionTag} from '../helper/questionTag';
import {QuixUtility} from '../helper/Utility';
import {QuixEvents} from './quixEvents';
import {QuestionType} from '../helper/QuestionType';
/**
 * Created by barthclem on 11/19/17.
 */
export class RoundsManager  {

    currentActiveTeam: Team;
    currentQuestionNumber: number;
    questionTags: QuestionTag [];
    private _numberOfTeams: number;
    private _currentTeamIndex: number;
    private _currentRoundIndex: number;

    constructor (private participatingTeams: Team [],
                 private questions: Question [],
                 private socketService: SocketService,
                 private quizParameters: QuizParams,
                 private quixEvents: QuixEvents,
                 private numberOfRounds: number
    ) {
        this.questionTags = QuixUtility.questionTagExtractor(questions);
        this._numberOfTeams = this.participatingTeams.length - 1;
        this.loadAllEventSubscriptions();
    }


    loadAllEventSubscriptions () {
        this.onUserBonusAttempt();
        this.onUserChoosingAQuestion();
        this.onTeamQuestionAnswerAttempt();
        this.onStartRound();
        this.onEndRound();
        this.onStartTeamSession();
        this.onEndTeamBonusSession();
        this.onEndOfStageRounds();
        this.onEndTeamSession();
        this.onStartTeamBonusSession();
    }

    chooseTeam (): Team {
        this.currentActiveTeam =  this.participatingTeams[Math.floor(this._currentTeamIndex % this.participatingTeams.length)];
        this.incrementIndex();
        console.log(`the current active team is = ${this.currentActiveTeam}`);
        return this.currentActiveTeam;
    }

    bonusTeam (): Team {
        return this.participatingTeams[(this._currentTeamIndex + 1) % this.participatingTeams.length];
    }

    incrementIndex (): void {
        ++this._currentTeamIndex;
        this._currentTeamIndex %= this.participatingTeams.length;
    }

    updateQuestionTag (questionNumber: number): void {
        const targetTag = this.questionTags.find((tag: QuestionTag) => {
            return tag.questionNumber === questionNumber;
        });
        if (targetTag) {
            targetTag.available = false;
        }

    }

    announceActiveTeam (): void {
        console.log(`Announce to everybody`);
       this.socketService.selectQuestionBroadcast(this.currentActiveTeam.name, this.questionTags);
    }

    getQuestion ( questionNumber: number): Question  {
        this.currentQuestionNumber = questionNumber;
        const randQue = {
            id: 0,
            type: QuestionType.PICTURE,
            category: '',
            questionText: '',
            options: []};
        const foundQuestion = this.questions.find( (x: Question) => x.id === questionNumber);
        return foundQuestion ? foundQuestion : randQue;
    }

    answerIsCorrect ( answer: string): boolean {
        return this.questions[this.currentQuestionNumber].answer === answer;
    }

    onUserChoosingAQuestion(): void {
        this.quizParameters.questionPickedEvent().onValueChanged(
            (queNumber) => {
                console.log(`A team  has selected Question => ${queNumber}`);
                const question = this.getQuestion(queNumber);
                this.updateQuestionTag(queNumber);
                this.socketService.sendQuestionBroadcast(question, this.currentActiveTeam.name);
            });

    }

    onTeamQuestionAnswerAttempt(): void {
        this.quizParameters.questionAttemptedEvent().onValueChanged(
            (queObj) => {
                console.log(`On Team Question Attempt => ${JSON.stringify(queObj)}`);
                this.decideOnAnswer(queObj.selectedOption, queObj.selectedOptionIndex, queObj.timeToAnswer);
            }
        );
    }

    onUserBonusAttempt(): void {
        this.quizParameters.bonusAttemptedEvent().onValueChanged(
            (queObj) => {
                this.decideOnBonusAnswer(queObj.selectedOption, queObj.selectedOptionIndex);
            }
        );
    }

    activateFourSecDelay ( func: Function, arg: any) {
        setTimeout(() => {
            func(arg);
        }, 4000);
    }

    decideOnAnswer (selectedOption: string, selectedOptionIndex: number, duration: number): void {
        if ( this.answerIsCorrect(selectedOption) ) {
           this.currentActiveTeam.scores.push({
               questionNumber: this.currentQuestionNumber,
               score: 5,
               duration: duration
           });
           this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.currentActiveTeam.name, true);
            this.activateFourSecDelay(this.quixEvents.fireEndOfTeamSessionEvent, 1);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.currentActiveTeam.name, false);
            this.activateFourSecDelay(this.quixEvents.fireTeamBonusSessionEvent, 1);
        }
    }

    announceBonusTeam (): void {
        this.socketService.sendBonusBroadcast(this.bonusTeam().name);
    }

    decideOnBonusAnswer (selectedOption: string, selectedOptionIndex: number): void {
        if ( this.answerIsCorrect(selectedOption) ) {
            this.bonusTeam().scores.push({
                questionNumber: this.currentQuestionNumber,
                score: 2,
                duration: 0
            });
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.bonusTeam().name, true);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.bonusTeam().name, false);
        }
        this.activateFourSecDelay(this.quixEvents.fireEndOfTeamBonusSessionEvent, 1);
    }


    onStartTeamBonusSession (): void {
        this.quixEvents.startTeamBonusSessionEvent()
            .onValueChanged(() => {
                this.announceBonusTeam();
                const question = this.getQuestion(this.currentQuestionNumber);
                if (question) {
                    this.socketService.sendQuestionBroadcast(question, this.bonusTeam().name);
                }
            });
    }

    onEndTeamBonusSession (): void {
        this.quixEvents.endOfTeamBonusSessionEvent()
            .onValueChanged(() => {
                this.quixEvents.fireEndOfTeamSessionEvent(1);
            });
    }

    onStartTeamSession (): void {
        this.quixEvents.startTeamSessionEvent()
            .onValueChanged(() => {
                this.chooseTeam();
                this.announceActiveTeam ();
            });
    }

    onEndTeamSession (): void {
        this.quixEvents.endOfTeamSessionEvent()
            .onValueChanged(() => {
                if (this._currentTeamIndex === this._numberOfTeams) {
                    this.quixEvents.fireEndOfRoundEvent(this._currentRoundIndex);
                } else {
                    this.quixEvents.fireNewTeamSessionEvent(this._currentTeamIndex);
                }
            });
    }


    onStartRound (): void {
        this.quixEvents.startRoundEvent()
            .onValueChanged((round: number) => {
                console.log(` Round is about to start ROUND : ${round}`);
                this._currentTeamIndex = 0;
                this.quixEvents.fireNewTeamSessionEvent(this._currentRoundIndex);
            });

    }

    onEndRound (): void {
        this.quixEvents.endOfRoundEvent()
            .onValueChanged((round: number) => {
            console.log(`End of round ${round}`);
            if (this._currentRoundIndex === this.numberOfRounds) {
                this.quixEvents.fireEndOfStageRoundsEvent(1);
            } else {
                this.quixEvents.firstNewRoundEvent(++this._currentRoundIndex);
            }
            });
    }

    onEndOfStageRounds(): void {
        this.quixEvents.endOfStageRoundsEvent()
            .onValueChanged(() => {
                this.quixEvents.fireEndStageEvent(1);
            });
    }


    startRounds (): void {
        console.log(`Started Rounds`);
        this.quixEvents.firstNewRoundEvent(1);
    }

}
