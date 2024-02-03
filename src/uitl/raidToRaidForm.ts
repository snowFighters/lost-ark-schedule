import {Raid} from "../domain/Raid.js";
import contentService from "../service/content.js";
import {Content} from "../domain/content.js";
import {RaidForm} from "../domain/form/RaidForm.js";

export async function raidToRaidForm(raid: Raid){
  const content = await contentService.findById(raid.contentId);
  if(typeof content == "string" || typeof content == null){
    return null;
  }
  return {
    id: raid.id,
    guildId:  raid.guildId,
    content: content,
    name: raid.name,
    appoinmentTime: raid.appoinmentTime
  } as RaidForm;
}