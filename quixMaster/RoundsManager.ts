import {Team} from '../helper/Team';
import {Question} from '../helper/question';
import {SocketService} from '../SocketService';
import {QuizParams} from './QuixParams';
import {QuestionTag} from '../helper/questionTag';
import {QuixUtility} from '../helper/Utility';
import {QuixEvents} from './quixEvents';
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
        this.onUserBonusAttempt();
        this.onUserChoosingAQuestion();
        this.onUserQuestionAttempt();
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

    updateQuestionTag (questionNumber: number): boolean {
        const targetTag = this.questionTags.find((tag) => {
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
        return this.questions.find( x => x.id === questionNumber);
    }

    answerIsCorrect ( answer: string): boolean {
        return this.questions[this.currentQuestionNumber].answer === answer;
    }

    onUserChoosingAQuestion(): void {
        this.quizParameters.questionPickedEvent().onValueChanged(
            (queNumber) => {
                const question = this.getQuestion(queNumber);
                this.updateQuestionTag(this.quizParameters.selectedQuestion);
                this.socketService.sendQuestionBroadcast(question, this.currentActiveTeam.name);
            });

    }

    onUserQuestionAttempt(): void {
        this.quizParameters.questionAttemptedEvent().onValueChanged(
            (queObj) => {
                this.decideOnAnswer(queObj.selectedOption, queObj.timeToAnswer);
            }
        );
    }

    onUserBonusAttempt(): void {
        this.quizParameters.bonusAttemptedEvent().onValueChanged(
            (selectedOption) => {
                this.decideOnBonusAnswer(selectedOption);
            }
        );
    }

    decideOnAnswer (selectedOption: string, duration: number): void {
        if ( this.answerIsCorrect(selectedOption) ) {
           this.currentActiveTeam.scores.push({
               questionNumber: this.currentQuestionNumber,
               score: 5,
               duration: duration
           });
           this.socketService.broadcastSelectedAnswer(selectedOption, this.currentActiveTeam.name, true);
            this.quixEvents.fireEndOfTeamSessionEvent(1);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, this.currentActiveTeam.name, false);
        }
    }

    announceBonusTeam (): void {
        this.socketService.sendBonusBroadcast(this.bonusTeam().name);
    }

    decideOnBonusAnswer (selectedOption: string): void {
        if ( this.answerIsCorrect(selectedOption) ) {
            this.bonusTeam().scores.push({
                questionNumber: this.currentQuestionNumber,
                score: 2,
                duration: 0
            });
            this.socketService.broadcastSelectedAnswer(selectedOption, this.bonusTeam().name, true);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, this.bonusTeam().name, false);
        }
        this.quixEvents.fireTeamBonusSessionEvent(1);
    }


    onStartTeamBonusSession (): void {
        this.quixEvents.startTeamBonusSessionEvent()
            .onValueChanged(() => {
                this.announceBonusTeam();
                const question = this.getQuestion(this.quizParameters.selectedQuestion);
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
                this.socketService.selectQuestionBroadcast(this.currentActiveTeam.name, this.questionTags);
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


    startRounds (): string {
        console.log(`Started Rounds`);
        this.quixEvents.firstNewRoundEvent(1);
    }

}
