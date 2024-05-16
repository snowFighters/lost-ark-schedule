import {Tspec} from "tspec";
import {User} from "./User.js";
import {Guild} from "./Guild.js";

export interface Raid {
  id: number,
  guildId: number,
  contentId: number,
  name: string,
  appoinmentTime: string;
  isRegular: number;
}

export function isRaid(obj: any): obj is Raid {
  if (typeof obj.guildId != "number") return false;
  if (typeof obj.contentId != "number") return false;
  if (typeof obj.name != 'string') return false;
  return true;
}

export interface RaidCreate extends Omit<Raid, "id"> {
}

export function isRaidCreate(obj: any): obj is RaidCreate {
  if (typeof obj.guildId != "number") return false;
  if (typeof obj.contentId != "number") return false;
  if (typeof obj.name != 'string') return false;
  if (typeof obj.isRegular != "number") return false;
  return true;
}

export type RaidApiSpec = Tspec.DefineApiSpec<{
  tags: ['Raid'],
  paths: {
    '/raids': {
      post: {
        summary: '레이드 추가',
        body: RaidCreate,
      }
    }
    '/raids/{raidId}': {
      get: {
        summary: "레이드 조회",
        path: { raidId: string }
      },
      put:{
        summary: '레이드 수정',
        path: { raidId: string },
        body:RaidCreate
      },
      delete: {
        summary: '레이드 삭제',
        path: { raidId: string },
        responses: { insertId: number },
      },
    },
    '/raids/{raidId}/members': {
      get: {
        summary: '레이드 멤버 조회',
        path: { raidId: string },
      },
      post: {
        summary: '레이드 멤버 추가',
        path: { raidId: string },
        body:{memberId:number, character:string, role:string}
      }
    }
    '/raids/{raidId}/users/{userId}': {
      delete: {
        summary: '멤버 삭제',
        path: { raidId: string, userId: string },
        body: { character: string },
        responses: { insertId: number },
      },
    },
  }
}>;


