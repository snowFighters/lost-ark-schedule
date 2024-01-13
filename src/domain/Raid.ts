export interface Raid {
    id:number,
    guildId:number,
    contentId:number,
    name:string,
    appoinmentTime : string;
}

export function isRaid(obj:any): obj is Raid{
    if( typeof obj.guildId != "number") return false;
    if( typeof obj.contentId != "number") return false;
    if(typeof  obj.name != 'string') return false;
    return true;
}

