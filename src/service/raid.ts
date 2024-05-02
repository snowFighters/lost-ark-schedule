import {isRaid, Raid} from "../domain/Raid.js";
import raidRepository from "../reposiroty/raid.js";
import {Guild} from "../domain/Guild.js";
import {Content} from "../domain/content.js";
import {isUser, User} from "../domain/User.js";
import raidMemberRepository from "../reposiroty/raidMember.js";
import userService from "./user.js";
import {RaidMember} from "../domain/form/RaidMember.js";
import {raidToRaidForm} from "../util/raidToRaidForm.js";

async function save(raid: Raid) {
  const result = await raidRepository.save(raid);
  return result;
}

async function saveByGuildAndContent(guild: Guild, content: Content, name: string, appoinmentTime: string) {
  const raid = {guildId: guild.id, contentId: content.id, name: name, appoinmentTime: appoinmentTime} as Raid
  const result = await raidRepository.save(raid);
  return result
}

async function findById(id: number) {
  return await raidRepository.findById(id);
}

async function findByGuild(guild: Guild) {
  return await raidRepository.findByGuild(guild);
}

async function findMembersByRaid(raid: Raid) {
  const results = await raidMemberRepository.findByRaid(raid);
  if (results instanceof Array) {
    return Promise.all(results.map(async (result) => {
      const user = await userService.findById(result.userId);
      if (isUser(user)) {
        return {
          user: user,
          character: result.character,
        } as RaidMember;
      }
    }));
  }
  return results;
}
async function deleteById(raidId:number){
  return await raidRepository.deleteById(raidId);
}

async function findRaidByUserId(userId: number) {
  const results = await raidMemberRepository.findByUserId(userId);
  if (results instanceof Array) {
    return Promise.all(results.map(async (result) => {
      const raid = await raidRepository.findById(result.raidId);
      if (isRaid(raid)) {
        return raidToRaidForm(raid);
      }
    }));
  }
  return results;
}

async function joinRaid(raid: Raid, user: User, character: string) {
  return await raidMemberRepository.save(raid, user, character);
}


async function exitRaid(raidId:number, userId:number, character:string){
  return await raidMemberRepository.deleteByIdAndUserAndCharacter(raidId, userId, character);
}



const raidService = {save, saveByGuildAndContent, findByGuild, findById, deleteById, joinRaid, findMembersByRaid, exitRaid, findRaidByUserId};

export default raidService;