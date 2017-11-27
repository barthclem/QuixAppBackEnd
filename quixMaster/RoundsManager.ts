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
    }


    chooseTeam () {
        this.currentActiveTeam =  this.participatingTeams[Math.floor(this._currentTeamIndex % this.participatingTeams.length)];
        this.incrementIndex();
        console.log(`the current active team is = ${this.currentActiveTeam}`);
        return this.currentActiveTeam;
    }

    bonusTeam () {
        return this.participatingTeams[(this._currentTeamIndex + 1) % this.participatingTeams.length];
    }

    incrementIndex () {
        ++this._currentTeamIndex;
        this._currentTeamIndex %= this.participatingTeams.length;
    }

    updateQuestionTag (questionNumber: number) {
        const targetTag = this.questionTags.find((tag) => {
            return tag.questionNumber === questionNumber;
        });
        if (targetTag) {
            targetTag.available = false;
        }

    }

    announceActiveTeam () {
        console.log(`Announce to everybody`);
       this.socketService.selectQuestionBroadcast(this.currentActiveTeam.name, this.questionTags);
    }

    getQuestion ( questionNumber: number)  {
        this.currentQuestionNumber = questionNumber;
        return this.questions.find( x => x.id === questionNumber);
    }

    answerIsCorrect ( answer: string) {
        return this.questions[this.currentQuestionNumber].answer === answer;
    }

    waitForUserToChooseQuestion() {
        this.quizParameters.questionPicked.onValueChanged(
            (queNumber) => {
                const question = this.getQuestion(queNumber);
                this.updateQuestionTag(this.quizParameters.selectedQuestion);
                this.socketService.sendQuestionBroadcast(question, this.currentActiveTeam.name);
            });

    }

    waitForUserToAttemptQuestion() {
        this.quizParameters.questionAttempted.onValueChanged(
            (queObj) => {
                this.decideOnAnswer(queObj.selectedOption, queObj.timeToAnswer)
            }
        );
    }

    waitForUserToAttemptBonus() {
        this.quizParameters.bonusAttempted.onValueChanged(
            (selectedOption) => {
                this.decideOnBonusAnswer(selectedOption);
            }
        );
    }

    decideOnAnswer (selectedOption: string, duration: number) {
        if ( this.answerIsCorrect(selectedOption) ) {
           this.currentActiveTeam.scores.push({
               questionNumber: this.currentQuestionNumber,
               score: 5,
               duration: duration
           });
           this.socketService.broadcastSelectedAnswer(selectedOption, this.currentActiveTeam.name, true);
           this.quixEvents.endOfTeamSession = 1;
        } else {
            this.socketService.broadcastSelectedAnswer(selectedOption, this.currentActiveTeam.name, false);
            this.startBonusRound();
        }
    }

    announceBonusTeam () {
        this.socketService.sendBonusBroadcast(this.bonusTeam().name);
    }

    decideOnBonusAnswer (selectedOption: string) {
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
        this.quixEvents.endOfTeamBonusSession = 1;
    }



    startBonusRound () {


    }

    onStartTeamBonusSession () {
        this.quixEvents.startTeamBonusSession
            .onValueChanged(()=> {
                this.announceBonusTeam();
                const question = this.getQuestion(this.quizParameters.selectedQuestion);
                if(question) {
                    this.socketService.sendQuestionBroadcast(question, this.bonusTeam().name);
                }
            });
    }

    onEndTeamBonusSession () {
        this.quixEvents.endOfTeamBonusSession
            .onValueChanged(() => {
                this.quixEvents.endOfTeamSession =1;
            });
    }

    onStartTeamSession () {
        this.quixEvents.startTeamSession
            .onValueChanged(() => {
                this.chooseTeam();
                this.announceActiveTeam ();
                this.socketService.selectQuestionBroadcast(this.currentActiveTeam.name, this.questionTags);
                this.waitForUserToChooseQuestion();
                const question = this.getQuestion(this.quizParameters.selectedQuestion);
                if(question) {
                    this.updateQuestionTag(this.quizParameters.selectedQuestion);
                    this.socketService.sendQuestionBroadcast(question, this.currentActiveTeam.name);
                }
            });
    }

    onEndTeamSession () {
        this.quixEvents.endOfTeamSession
            .onValueChanged(() => {
                if(this._currentTeamIndex === this.participatingTeams.length-1) {
                    this.quixEvents.endOfRoundEvent = this._currentTeamIndex;
                }
                else {
                    this.quixEvents.startTeamSession = this._currentRoundIndex;
                }
            });
    }


    startRound () {
        this.quixEvents.startRoundEvent
            .onValueChanged(()=> {
                console.log(` Round is about to start`);
                this._currentTeamIndex = 0;
                this.quixEvents.startTeamSession = this._currentRoundIndex;
            });

    }

    startRounds (): string {
        console.log(`Started Rounds`);
        this.startRound();
        // for (let j = 0; j < this.numberOfRounds ; j++ ) {
        //     console.log(`Start of Round - ${j + 1}`);
        //     this.startRound();
        //     console.log(`End of Round - ${j + 1}`);
        // }
        return 'Finished Round';
    }

}
