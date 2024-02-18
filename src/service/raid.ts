import {Raid} from "../domain/Raid.js";
import raidRepository from "../reposiroty/raid.js";
import {Guild} from "../domain/Guild.js";
import {Content} from "../domain/content.js";
import {isUser, User} from "../domain/User.js";
import raidMemberRepository from "../reposiroty/raidMember.js";
import guildMemberRepository from "../reposiroty/guildMember.js";
import userRepository from "../reposiroty/user.js";
import userService from "./user.js";
import {RaidMember} from "../domain/form/RaidMember.js";

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

async function joinRaid(raid: Raid, user: User, character: string) {
  return await raidMemberRepository.save(raid, user, character);
}

const raidService = {save, saveByGuildAndContent, findByGuild, findById, joinRaid, findMembersByRaid};
export default raidService;