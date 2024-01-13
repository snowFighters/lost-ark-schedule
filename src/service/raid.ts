import {Raid} from "../domain/Raid.js";
import raidRepository from "../reposiroty/raid.js";
import {Guild} from "../domain/Guild.js";
import {Content} from "../domain/content.js";
import {User} from "../domain/User.js";
import raidMemberRepository from "../reposiroty/raidMember.js";
import guildMemberRepository from "../reposiroty/guildMember.js";
import userRepository from "../reposiroty/user.js";

async function save(raid:Raid){
  const result = await raidRepository.save(raid);
  return result;
}

async function saveByGuildAndContent(guild : Guild, content:Content, name:string, appoinmentTime:string){
  const raid = {guildId:guild.id, contentId: content.id, name:name, appoinmentTime : appoinmentTime} as Raid
  const result = await raidRepository.save(raid);
  return result
}

async function findById(id:number){
  return await raidRepository.findById(id);
}

async function findByGuild(guild:Guild){
  return await raidRepository.findByGuild(guild);
}
async function findMembersByRaid(raid:Raid){
  const result = await raidMemberRepository.findByRaid(raid);
  if(result instanceof Array){
    return await userRepository.findByIdList(result);
  }
  return result;
}

async function joinRaid(raid:Raid, user:User, character:string){
  return await raidMemberRepository.save(raid, user, character);
}

const raidService = {save, saveByGuildAndContent,  findByGuild, findById, joinRaid, findMembersByRaid};
export default raidService;