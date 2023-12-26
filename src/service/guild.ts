import {Guild} from "../domain/Guild.js";

import guildRepository from "../reposiroty/guild.js";
import {User} from "../domain/User.js";
import guildMemberRepository from "../reposiroty/guildMember.js";
import userRepository from "../reposiroty/user.js";

async function save(guild:Guild){
  return await guildRepository.save(guild);
}

async function findById(id:number){
  return await guildRepository.findById(id);
}

async function findByCode(code:string){
  return await guildRepository.findByCode(code);
}

async function findMembersByGuild(guild:Guild){
  const result = await guildMemberRepository.findByGuild(guild);
  if(result instanceof Array){
    return await userRepository.findByIdList(result);
  }
  return result;
}

async function joinGuild(guild:Guild, user:User){
  return await guildMemberRepository.save(guild, user);
}

const guildService = {save, findById, findByCode, joinGuild, findMembersByGuild};

export default guildService;