import {Raid, RaidCreate} from "../domain/Raid.js";
import schedule from "node-schedule";
import raidService from "../service/raid.js";
import userService from "../service/user.js";

export async function asdasd(raidId: number) {
  const raid = await raidService.findById(raidId);
  if (!raid) return;
  
  let date = new Date(raid.appoinmentTime);
  
  const job = schedule.scheduleJob(date, async function () {
    console.log(`[${new Date()}]  ${raid.id}.${raid.name} 푸시알림 발동`)
    
    let date1 = new Date(raid.appoinmentTime);
    date1.setSeconds(date1.getSeconds() + 10);
    
    const raid2 = await raidService.findById(raidId);
    if (!raid2) return;
    
    if (raid2.isRegular == 1) {
      const raidCreate = {
        guildId: raid.guildId,
        contentId: raid.contentId,
        name: raid.name,
        appoinmentTime: `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()} ${date1.getHours()}:${date1.getMinutes()}:${date1.getSeconds()}`,
        isRegular: raid.isRegular
      } as RaidCreate
      
      const result = await raidService.save(raidCreate);
      if (!result) return;
      
      const raid1 = await raidService.findById(result.insertId);
      if (!raid1) return;
      
      const members = await raidService.findMembersByRaid(raid2);
      if(!members) return;
      
        members.map(async (member) => {await raidService.joinRaid(raid1, member.user, member.character, member.role)});
      
      asdasd(raid1.id);
    }
    
  })
}