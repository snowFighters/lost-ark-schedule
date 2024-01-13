import {Tspec} from "tspec";
import {User} from "./User";

export interface Guild {
  id: number,
  name: string,
  code: string,
}

export function isGuild(obj: any): obj is Guild {
  if (typeof obj.name != "string") return false
  else if (typeof obj.code != "string") return false
  return true;
}

export type GuildApiSpec = Tspec.DefineApiSpec<{
  tags:['Guild'],
  paths: {
    '/guilds': {
      post: {
        summary: '길드 생성하기',
        body: { name: string},
        responses: { insertId: number },
      },
    },
    '/guilds/{code}': {
      get: {
        summary: '길드 코드로 찾아오기',
        path: { code: string },
        responses: { 200: Guild },
      },
    },
    '/guilds/{guildId}/members': {
      get: {
        summary: '길드의 유저 찾아오기',
        path: { guildId: number },
        responses: { guild: Guild, users:User[] },
      },
    },
    '/guilds/{guildId}/members/{userId}': {
      post: {
        summary: '길드에 유저 가입시키기 ',
        path: { guildId: number, userId:number },
        responses: { insertId:number },
      },
    },
    '/guilds/{guildId}/raids': {
      get: {
        summary: '길드 레이드 전체 조희 ',
        path: { guildId: number },
        responses: { },
      },
    },
    '/guilds/{guildId}/raids/{raidId}': {
      get: {
        summary: '길드 레이드 조희 ',
        path: { guildId: number, raidId:number },
        responses: { },
      },
    },
    '/guilds/{guildId}/raids/{contentId}': {
      post: {
        summary: '길드에 레이드 생성하기 ',
        path: { guildId: number, contentId:number },
        body:{ name:string, appoinmentTime:string}
        responses: { insertId:number },
      },
    },
    '/guilds/{guildId}/raids/{raidId}/members': {
      get: {
        summary: '레이드 첨여 인원 전체 조회 ',
        path: { guildId: number, raidId:number, },
        responses: { },
      },
    },
    '/guilds/{guildId}/raids/{raidId}/members/{userId}': {
      post: {
        summary: '레이드 집어넣기 ',
        path: { guildId: number, raidId:number, userId:number},
        body:{ character:string,}
        responses: { insertId:number },
      },
    },
  }
}>;


