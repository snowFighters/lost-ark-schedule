import validateEmail from "../util/validateEmail.js";
import {Tspec} from "tspec";


export interface User {
  id: number,
  email: string,
  password: string,
  characterName: string
}

export function isUser(obj: any): obj is User {
  if (typeof obj.email != "string" || !validateEmail(obj.email)) return false;
  if (typeof obj.password != "string") return false;
  if (typeof obj.characterName != "string") return false;
  return true
}

export type UserApiSpec = Tspec.DefineApiSpec<{
  tags:['User'],
  paths: {
    '/users': {
      get:{
        summary:"이메일로 유저 조회하기",
        query:{email:string}
      }
      post: {
        summary: '유저 저장하기',
        body: { email: string, password: string, characterName: string },
        responses: { insertId: number },
      },
      patch: {
        summary: '유저 이름 수정',
        body: { email: string, password: string, characterName: string },
        responses: { insertId: number },
      },
    },
    '/users/{id}': {
      get: {
        summary: '유저 찾아오기',
        path: { id: number },
        responses: { 200: User },
      },
    },
    '/users/{id}/guilds': {
      get: {
        summary: '유저 찾아오기',
        path: { id: number },
        responses: { 200: User },
      },
    },
    '/users/{id}/raids': {
      get: {
        summary: '유저 찾아오기',
        path: { id: number },
        responses: { 200: User },
      },
    },
    '/users/{id}/character': {
      get: {
        summary: '유저 찾아오기',
        path: { id: number },
        responses: { 200: User },
      },
    },
  }
}>;

