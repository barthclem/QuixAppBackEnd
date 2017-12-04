import {Question} from '../helper/question';
import {PseudoQuestions} from '../data/QuestionData';
import {QuixUtility} from '../helper/Utility';
import {QuestionStage} from './QuestionStages';
import {Team} from '../helper/Team';
import {RoundsManager} from './RoundsManager';
import {SocketService} from '../SocketService';
import {QuizParams} from './QuixParams';
import {QuixEvents} from './quixEvents';
/**
 * Created by barthclem on 11/20/17.
 */
export class StageManager {

   private stages: string [];
   private questionStages: QuestionStage [];
   private qualifiedTeams: Team [];
   private _quizParams: QuizParams;
   private _quixEvents: QuixEvents;
   private _numberOfStages: number;
   private _currentStageIndex: number;
   private _numberOfReducibleStages: number;
   private _reducibleStageIndex: number;
   private _currentStage: QuestionStage;
   private stageRoundsManager: RoundsManager;
   private MAX_NUMBER_OF_ROUNDS = 3;

    constructor(private questionData: Question[], private teams: Team[], private socketService: SocketService) {
        this.qualifiedTeams = teams;
        this.setUpQuestions(questionData);
        this._quixEvents = new QuixEvents();
        this.onEndOfAllStagesEvent();
        this.onEndOfStage();
        this.onStartOfAllStages();
        this.onStartOfStage();
    }

    setUpQuestions (questions: Question []): void {
        const questionData = PseudoQuestions;
        this.stages = QuixUtility.stageExtractor(questionData);
        this.questionStages = QuixUtility.questionClassifier(this.stages, questionData);
        this.questionStages.map(stage => QuixUtility.numberOfRoundsCalc(stage, this.qualifiedTeams.length, this.MAX_NUMBER_OF_ROUNDS));
    }

    startNewStage (): void {
        this._quixEvents.firstNewStageEvent(this._currentStageIndex + 1);
    }

    initializeNewStage (): void {
        this._currentStage = this.questionStages[this._currentStageIndex++];
        this.qualifiedTeams = this.produceQualifiedTeamsList();
        console.log(`Welcome to stage ${this._currentStageIndex}`);
        this.socketService.broadcastNewCategory(this._currentStage.title, this._currentStage.numberOfRounds,
            this.qualifiedTeams.map((team: Team) => team.name));
        this.stageRoundsManager = new RoundsManager(this._currentStage.title, this.teams, this.qualifiedTeams, this._currentStage.entries,
            this.socketService, this.quizParams, this.quixEvents, this._currentStage.numberOfRounds);
    }

    onStartOfAllStages (): void {
        this._quixEvents.startAllStagesEvent()
            .onValueChanged((numberOfStages) => {
               this._numberOfStages = numberOfStages;
               this._currentStageIndex = 0;
               this._numberOfReducibleStages = this.determineReducibleStages(this.teams.length);
                this._reducibleStageIndex = this.determineReducibleStageIndex(this._numberOfStages, this._numberOfReducibleStages);
               this.initializeNewStage();
               this.startNewStage();
            });
    }

   onEndOfAllStagesEvent (): void {
        this._quixEvents.endOfAllStagesEvent()
            .onValueChanged((numberOfStages) => {
               this._numberOfStages = numberOfStages;
            });
   }

   onStartOfStage (): void {
       this._quixEvents.startStageEvent()
           .onValueChanged(() => {
           console.log(` Start of new Stage: ${this._currentStageIndex}`);
              this.stageRoundsManager.startRounds();
           });
   }

   onEndOfStage (): void {
       this._quixEvents.endStageEvent()
           .onValueChanged(() => {
               if (this._currentStageIndex === this._numberOfStages - 1) {
                   console.log(`End of all rounds of STAGE ${this._currentStageIndex}`);
                   this._quixEvents.fireEndOfAllStagesEvent(1);
               } else {
                   this._quixEvents.firstNewStageEvent(1);
                   this.initializeNewStage();
                   this.startNewStage();
               }
           });
   }


    runStages(): void {
        console.log(` Starting the stage runner`);
        this._quixEvents.firstStartAllStagesEvent(this.questionStages.length);
    }

    get quixEvents(): QuixEvents {
        return this._quixEvents;
    }

    get quizParams(): QuizParams {
        return this._quizParams;
    }

    set quizParams(value: QuizParams) {
        this._quizParams = value;
    }


    /**
     * @name determineReducibleStages
     * @description this is the method that is responsible for determining the number of stages in which teams can be evicted from the
     * competition
     * @param noOfTeams - this gives the number of participating teams at the beginning of the competition
     * @returns {number}
     */
    determineReducibleStages (noOfTeams: number): number {
        let noOfReducibleStage = 1;
        switch (noOfTeams) {
            case 2:
                noOfReducibleStage = 0;
                break;
            case 3:
                noOfReducibleStage = 1;
                break;
            case 4:
                noOfReducibleStage = 2;
                break;
            case 5:
                noOfReducibleStage = 2;
                break;
            case 6:
                noOfReducibleStage = 3;
                break;
            default:
                console.log(`invalid number of teams : the max number of teams is 6`);
        }
        return noOfReducibleStage;
    }

    /**
     * @name determineReducibleStageIndex
     * @description - this method  is called at the beginning of all stages  to
     * -calculate the index of the stage at which the eviction would start.
     * @param noOfStages - this gives the total number of stages at the beginning of the competition
     * @param noOfReducibleStages - this is the number of stages in the competition in which teams could be disqualified
     * @returns {number}
     */
    determineReducibleStageIndex (noOfStages: number, noOfReducibleStages: number): number {
        let reducibleIndex = 0;
        if ( noOfStages > noOfReducibleStages ) {
            reducibleIndex = noOfStages - noOfReducibleStages;
        } else {
            reducibleIndex = 1;
        }
        return reducibleIndex;
    }

    /**
     * @name produceQualifiedTeamsList
     *@description - this runs at the beginning of new stages.
     * - it produces the teams that are qualified for the new stage based on previously determined parameters
     * @returns {Team[]}
     */
    produceQualifiedTeamsList (): Team [] {
        if (this._currentStageIndex >= this._reducibleStageIndex) {
            const noOfDisqualifiedTeams = Math.round(0.3 * this.qualifiedTeams.length);
            const disQualifiedTeamStartPos = this.qualifiedTeams.length - noOfDisqualifiedTeams;
            return this.qualifiedTeams.filter(team => team.position < disQualifiedTeamStartPos);
        } else {
            return this.qualifiedTeams;
        }
    }

}
