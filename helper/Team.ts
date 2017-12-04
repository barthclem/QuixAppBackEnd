import {TeamScore} from './TeamScore';
/**
 * Created by barthclem on 11/19/17.
 */
export interface  Team {
    name: string;
    scores: TeamScore [];
    totalScore: number;
    position: number;
    qualified: boolean;
    members: string[];
    teamStatus: string;
    updateScore: Function;
}