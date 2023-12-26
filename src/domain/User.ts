import validateEmail from "../uitl/validateEmail.js";

export interface User{
  id:number,
  email:string,
  password:string,
  characterName:string
}

export function isUser(obj:any):obj is User {
  if(typeof obj.email != "string" || !validateEmail(obj.email)) return false;
  if(typeof obj.password != "string") return false;
  if(typeof obj.characterName != "string") return false;
  return true
}

