import guildService from "../service/guild.js";
import {Guild, isGuild} from "../domain/Guild.js";

export async function createGuild(name:string){
  let code = Math.random().toString(36).substring(2, 11);

  while (isGuild(await guildService.findByCode(code))){
    code = Math.random().toString(36).substring(2, 11);
  }
  return {
    name:name,
    code:code
  } as Guild
}


