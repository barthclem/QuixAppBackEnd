///<reference path="Team.ts"/>
import {Team} from './Team';
import {TeamScore} from './TeamScore';
/**
 * Created by barthclem on 11/21/17.
 */
export class TeamImpl implements Team {

    private _scores: TeamScore[];
    private _qualified: boolean;
    private _members: string[];
    private _teamStatus: string;
    private _position: number;
    private _totalScore: number;

    constructor (private _name: string) {
        this.members = [];
        this.teamStatus = '';
        this.scores = [];
        this.totalScore = 0;
        this.position = 1;
    }

    get totalScore(): number {
        return this._totalScore;
    }

    set totalScore(value: number) {
        this._totalScore = value;
    }
    get position(): number {
        return this._position;
    }

    set position(value: number) {
        this._position = value;
    }

    get members(): string[] {
        return this._members;
    }

    set members(value: string[]) {
        this._members = value;
    }


    get qualified(): boolean {
        return this._qualified;
    }

    set qualified(value: boolean) {
        this._qualified = value;
    }
    get scores(): TeamScore[] {
        return this._scores;
    }

    set scores(value: TeamScore[]) {
        this._scores = value;
    }
    get name(): string {
        return this._name;
    }

    set name(value: string) {
        this._name = value;
    }

    getTeamName () {
        return this.name;
    }

    addMember ( member: string ) {
        if (!this.members.find(user => member === user)) {
            this.members.push(member);
        }
    }

    removeMember ( member: string ) {
        const pendingUser = this.members.find(user => member === user);
        if (pendingUser) {
            this.members.splice(this.members.indexOf(pendingUser), 1);
        }
    }

    getMemberList () {
        return this.members;
    }

    get teamStatus(): string {
        return this._teamStatus;
    }

    set teamStatus(value: string) {
        this._teamStatus = value;
    }

    getTeamPopulation () {
        return this.members.length;
    }

    updateScore ( stageName: string, questionNumber: number, score: number, duration: number) {
        this.scores.push({
            stageName: stageName,
            questionNumber: questionNumber,
            score: score,
            duration: duration
        });
        this.totalScore += score;
    }

}
