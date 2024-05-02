import guildService from "../service/guild.js";
import {Guild, GuildCreate, isGuild} from "../domain/Guild.js";

export async function createGuild(guildCreate:GuildCreate){
  let code = Math.random().toString(36).substring(2, 11);

  while (isGuild(await guildService.findByCode(code))){
    code = Math.random().toString(36).substring(2, 11);
  }
  return {
    name:guildCreate.name,
    code:code
  } as Guild
}


