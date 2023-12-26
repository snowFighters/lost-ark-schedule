import {User} from "../domain/User.js";

import userRepository from "../reposiroty/user.js";
import guildMemberRepository from "../reposiroty/guildMember.js";
import guildRepository from "../reposiroty/guild.js";

async function save(user:User){
  return await userRepository.save(user);
}
async function findById(id:number){
  return await userRepository.findById(id)
}

async function findGuildByUser(user:User){
  const guildList = await guildMemberRepository.findByUser(user);
  if(guildList instanceof Array){
    return await guildRepository.findByIdList(guildList);
  }
   return guildList;
}


const userService = {save, findById, findGuildByUser};
export default userService;