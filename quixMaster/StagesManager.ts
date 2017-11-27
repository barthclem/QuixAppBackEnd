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
    }

    setUpQuestions (questions: Question []) {
        const questionData = PseudoQuestions;
        this.stages = QuixUtility.stageExtractor(questionData);
        this.questionStages = QuixUtility.questionClassifier(this.stages, questionData);
        this.questionStages.map(stage => QuixUtility.numberOfRoundsCalc(stage, this.qualifiedTeams.length));
    }

    startNewStage () {
        this._quixEvents.startStageEvent = this._currentStageIndex +1;
    }

    initializeNewStage () {
        this._currentStage = this.questionStages[this._currentStageIndex++];
        this.socketService.broadcastNewCategory(this._currentStage.title, this._currentStage.numberOfRounds,
            this.qualifiedTeams.map(team => team.name));
        this.stageRoundsManager = new RoundsManager(this.qualifiedTeams, this._currentStage.entries, this.socketService,
            this.quizParams, this.quixEvents, this._currentStage.numberOfRounds);
    }

    onStartOfAllStages () {
        this._quixEvents.startAllStagesEvent
            .onValueChanged((numberOfStages) => {
               this._numberOfStages = numberOfStages;
               this._currentStageIndex = 0;
               this.initializeNewStage();
               this.startNewStage();
            });
    }

   onEndOfAllStagesEvent () {
        this._quixEvents.endOfAllStagesEvent
            .onValueChanged((numberOfStages) => {
               this._numberOfStages = numberOfStages;
            });
   }

   onStartOfStage () {
       this._quixEvents.startStageEvent
           .onValueChanged(() => {
           console.log(` Start of new Stage: ${this._currentStageIndex}`);
              this.stageRoundsManager.startRounds();
           });
   }

   onEndOfStage () {
       this._quixEvents.endStageEvent
           .onValueChanged(() => {
               if(this._currentStageIndex === this._numberOfStages-1) {
                   this._quixEvents.endOfAllStagesEvent = 1;
               }
               else {
                   this._quixEvents.startStageEvent = 0;
                   this.initializeNewStage();
                   this.startNewStage();
               }
           });
   }


    runStages() {
        console.log(` Starting the stage runner`);
        this._quixEvents.startAllStagesEvent = this.questionStages.length;
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
