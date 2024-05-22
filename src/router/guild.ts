import express from "express";
import {createGuild} from "../util/createGuild.js";
import {saveResponse, selectResponse} from "../util/saveResponse.js";

import {Guild, idGuildCreate, isGuild} from "../domain/Guild.js";

import guildService from "../service/guild.js";
import userService from "../service/user.js";
import {isUser} from "../domain/User.js";
import contentService from "../service/content.js";
import {isContent} from "../domain/content.js";
import raidService from "../service/raid.js";
import {isRaid} from "../domain/Raid.js";
import {raidToRaidForm} from "../util/raidToRaidForm.js";


const app = express.Router();
app.get("/", async (req, res) => {
  if( typeof req.query.code != 'string') return res.send(400);
  const result = await guildService.findByCode(req.query.code);
  if (result == null) return res.status(400).send("No object found");
  return res.send(result);
})

app.get("/:id", async (req, res) => {
  const result = await guildService.findById(parseInt(req.params.id));
  if (result == null) return res.status(400).send("No object found");
  return res.send(result);
})


app.get("/:guildId/members/", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if (!guild) {
    return res.status(400).send("GuildID is incorrect");
  }

  const members = await guildService.findMembersByGuild(guild);
  if (!members) {
    return res.status(400).send("no member found");
  }
  const result = await Promise.all(members.map(async (member) => {
    return await userService.findById(member)
  }));
  return res.send(result);
})

app.post("/", async (req, res) => {
  if (!idGuildCreate(req.body)) return res.sendStatus(400);
  const result = await guildService.save(await createGuild(req.body));

  if (result == null) return res.send(500);
  return res.send({insertId: result.insertId});
})

app.post("/:guildId/members/:userId", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.userId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const user = await userService.findById(parseInt(req.params.userId));
  if (!guild || !user) {
    return res.status(400).send({guild: guild, user: user});
  }
  const result = await guildService.joinGuild(guild, user);
  if (result == null) return res.send(500);
  return res.send({insertId: result.insertId});
})

app.get("/:guildId/raids", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if (!guild) {
    return res.status(400).send({guild: guild});
  }

  const raids = await raidService.findByGuild(guild);
  if (raids == null) return res.status(400).send("No raid Found");
  const result = await Promise.all(raids.map(async (raid) => {
    const content = await contentService.findById(raid.contentId);
    const counts = await raidService.readMemberCountByRaid(raid);
    const guild = await guildService.findById(raid.guildId);
    return {guild:guild,...raid, content, ...counts as any}
  }))
  return res.send(result);
})

export default app;