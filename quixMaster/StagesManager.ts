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
   private _currentStage: QuestionStage;
   private stageRoundsManager: RoundsManager;

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
        this.questionStages.map(stage => QuixUtility.numberOfRoundsCalc(stage, this.qualifiedTeams.length));
    }

    startNewStage (): void {
        this._quixEvents.firstNewStageEvent(this._currentStageIndex + 1);
    }

    initializeNewStage (): void {
        this._currentStage = this.questionStages[this._currentStageIndex++];
        this.socketService.broadcastNewCategory(this._currentStage.title, this._currentStage.numberOfRounds,
            this.qualifiedTeams.map((team: Team) => team.name));
        this.stageRoundsManager = new RoundsManager(this.qualifiedTeams, this._currentStage.entries, this.socketService,
            this.quizParams, this.quixEvents, this._currentStage.numberOfRounds);
    }

    onStartOfAllStages (): void {
        this._quixEvents.startAllStagesEvent()
            .onValueChanged((numberOfStages) => {
               this._numberOfStages = numberOfStages;
               this._currentStageIndex = 0;
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



}
