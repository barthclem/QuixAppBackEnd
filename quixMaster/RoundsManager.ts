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

    private stageName: string;
    private allTeams: Team [];
    private qualifiedTeams: Team [];
    private questions: Question [];
    private socketService: SocketService;
    private quizParameters: QuizParams;
    private quixEvents: QuixEvents;
    private numberOfRounds: number;

    constructor () {
        console.log(`\n\n New Round Manager Initiated  \n\n`);
    }

    setStageRoundsParameters (
         stageName: string,
         allTeams: Team [],
         qualifiedTeams: Team [],
         questions: Question [],
         socketService: SocketService,
         quizParameters: QuizParams,
         quixEvents: QuixEvents,
         numberOfRounds: number
    ) {
        this.stageName = stageName;
        this.allTeams = allTeams;
        this.qualifiedTeams = qualifiedTeams;
        this.questions = questions;
        this.socketService = socketService;
        this.quizParameters = quizParameters;
        this.quixEvents = quixEvents;
        this.numberOfRounds = numberOfRounds;

        this.questionTags = QuixUtility.questionTagExtractor(questions);
        this._numberOfTeams = this.qualifiedTeams.length;
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

    unSubscribeAllEvents () {

    }

    chooseTeam (): Team {
        console.log(`\n\n\n\n List Of Qualified Teams => ${this.qualifiedTeams}
         \n ActiveIndex => ${Math.floor(this._currentTeamIndex % this.qualifiedTeams.length)} \n\n\n\n`);
        this.currentActiveTeam =  this.qualifiedTeams[Math.floor(this._currentTeamIndex % this.qualifiedTeams.length)];
        console.log(`the current active team is = ${this.currentActiveTeam.name}`);
        return this.currentActiveTeam;
    }

    bonusTeam (): Team {
        return this.qualifiedTeams[(this._currentTeamIndex + 1) % this.qualifiedTeams.length];
    }

    incrementIndex (): void {
        ++this._currentTeamIndex;
        this._currentTeamIndex %= this.qualifiedTeams.length;
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
        const foundQuestion = this.questions.find( (x: Question) => x.id === this.currentQuestionNumber);
        return foundQuestion ? foundQuestion.answer === answer : false;
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

    sendTeamScores () {
        console.log(`List Team Position`);
        let position = 1;
        if ( this._currentRoundIndex > 1) {
            this.allTeams = QuixUtility.sortTeamsBasedOnPosition(this.allTeams);
        }
        this.allTeams.forEach(team => {
            team.position = position++;
            console.log(`\nPosition: ${team.position} TeamName: ${team.name}: TeamScore: ${team.totalScore}`);
        });
        this.socketService.broadcastTeamScoreUpdate(this.allTeams);
    }

    decideOnAnswer (selectedOption: string, selectedOptionIndex: number, duration: number): void {
        if ( this.answerIsCorrect(selectedOption) ) {
           this.currentActiveTeam.updateScore(this.stageName, this.currentQuestionNumber, 5, duration);
           this.sendTeamScores();
           this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.currentActiveTeam.name, true);
            setTimeout(() => {
                this.quixEvents.fireEndOfTeamSessionEvent(1);
            }, 4000);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.currentActiveTeam.name, false);
            setTimeout(() => {
                this.quixEvents.fireTeamBonusSessionEvent(1);
            }, 4000);
        }
    }

    announceBonusTeam (): void {
        this.socketService.sendBonusBroadcast(this.bonusTeam().name);
    }

    decideOnBonusAnswer (selectedOption: string, selectedOptionIndex: number): void {
        if ( this.answerIsCorrect(selectedOption) ) {
            this.bonusTeam().updateScore(this.stageName, this.currentQuestionNumber, 2, 0);
            this.sendTeamScores();
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.bonusTeam().name, true);
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, selectedOptionIndex, this.bonusTeam().name, false);
        }
        setTimeout(() => {
            this.quixEvents.fireEndOfTeamBonusSessionEvent(1);
        }, 2000);
    }


    onStartTeamBonusSession (): void {
        this.quixEvents.startTeamBonusSessionEvent()
            .onValueChanged(() => {
                console.log(`Tell them that it's time for bonus...Team ${this.bonusTeam().name} has the bonus`);
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
                 console.log(`\n\nStart of a new team session \n\n`);
                this.chooseTeam();
                this.announceActiveTeam ();
            });
    }

    onEndTeamSession (): void {
        this.quixEvents.endOfTeamSessionEvent()
            .onValueChanged(() => {
                console.log(`\nThe End of Team Session\n`);
                if ((this._currentTeamIndex + 1) === this._numberOfTeams) {
                    this.quixEvents.fireEndOfRoundEvent(this._currentRoundIndex);
                } else {
                    this.incrementIndex();
                    this.quixEvents.fireNewTeamSessionEvent(this._currentTeamIndex);
                }
            });
    }


    onStartRound (): void {
        this.quixEvents.startRoundEvent()
            .onValueChanged((round: number) => {
                console.log(`\n Round is about to start ROUND : ${round}`);
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
        console.log(`=>Started Rounds`);
        this._currentRoundIndex = 1;
        this.quixEvents.firstNewRoundEvent(1);
    }

}
