import {Content} from "../content.js";

export interface RaidForm {
  id: number,
  guildId: number,
  content: Content,
  name: string,
  appoinmentTime: string;
  isRegular:number;
}


export function isRaidForm(obj: any): obj is RaidForm {
  if (typeof obj.guildId != "number") return false;
  if (typeof obj.content != "object") return false;
  if (typeof obj.name != 'string') return false;
  return true;
}

