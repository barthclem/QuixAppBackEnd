/**
 * Created by barthclem on 10/15/17.
 */

export class TeamRoom {

    private members: string[];
    private teamStatus: string;

    constructor(private teamName: string ) {
        this.members = [];
        this.teamStatus = '';
    }

    getTeamName () {
        return this.teamName;
    }

    addMember ( member: string ) {
      if (! this.members.find(user => member === user)) {
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

    setTeamStatus ( teamStatus: string ) {
        this.teamStatus = teamStatus;
    }

    getTeamPopulation () {
        return this.members.length;
    }
}
