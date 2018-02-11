/**
 * Created by barthclem on 2/7/18.
 */
import * as Mongoose from 'mongoose';

export let Schema = Mongoose.Schema;
export let ObjectId = Mongoose.Schema.Types.ObjectId;
export let Mixed = Mongoose.Schema.Types.Mixed;


export interface ITeamSchema {
    teamName: string;
    score: number;
    position: number;
    members?: string [];
}

export interface  IGameModel extends  Mongoose.Document {
    name: string;
    link: string;
    teamList: ITeamSchema [];
    createdAt: Date;
    modifiedAt: Date;
}

export const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
        index: {
            unique: true,
            sparse: true }
    },
    link: {
        type: String,
        required: true
    },
    teamList: {
        type:  Array < ITeamSchema > (),
        required: false
    },
    createdAt: {
        type: Date,
        required: false
    },
 modifiedAt: {
        type: Date,
        required: false
 }
});
gameSchema.pre('save', function(this: any, next) {
    const self = this;
    if (self._doc) {
        const doc = <IGameModel>self._doc;
        const now = new Date();
        if ( !doc.createdAt) {
            doc.createdAt = now;
        }
        doc.modifiedAt = now;
    }
    next();
    return self;
});


export const GameModel = Mongoose.model<IGameModel>('Game', gameSchema);
