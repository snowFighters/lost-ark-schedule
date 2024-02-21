import {Tspec} from "tspec";
import {User} from "./User.js";
import {Guild} from "./Guild.js";

export interface Raid {
  id: number,
  guildId: number,
  contentId: number,
  name: string,
  appoinmentTime: string;
}

export function isRaid(obj: any): obj is Raid {
  if (typeof obj.guildId != "number") return false;
  if (typeof obj.contentId != "number") return false;
  if (typeof obj.name != 'string') return false;
  return true;
}

export type RaidApiSpec = Tspec.DefineApiSpec<{
  tags: ['Raid'],
  paths: {
    '/raids/{raidId}': {
      delete: {
        summary: '멤버 삭제',
        path: { raidId: string },
        responses: { insertId: number },
      },
    },
    '/raids/{raidId}/users/{userId}': {
      delete: {
        summary: '멤버 삭제',
        path: { raidId: string, userId:string },
        body: {character: string },
        responses: { insertId: number },
      },
    },
  }
}>;


