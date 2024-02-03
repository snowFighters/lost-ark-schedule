import express from "express";
import {createGuild} from "../uitl/createGuild.js";
import {saveResponse, selectResponse} from "../uitl/saveResponse.js";

import {Guild, isGuild} from "../domain/Guild.js";

import guildService from "../service/guild.js";
import userService from "../service/user.js";
import {isUser} from "../domain/User.js";
import contentService from "../service/content.js";
import {isContent} from "../domain/content.js";
import raidService from "../service/raid.js";
import {isRaid} from "../domain/Raid.js";
import {raidToRaidForm} from "../uitl/raidToRaidForm.js";


const app = express.Router();
app.get("/", (req, res) => {
  return res.send("OK");
})

app.get("/:code", async (req, res) => {
  const result = await guildService.findByCode(req.params.code);
  return selectResponse(result, res);
})

app.get("/:guildId/members/", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if (!isGuild(guild)) {
    return res.status(400).send({guild: guild});
  }

  const result = {guild: guild, member: await guildService.findMembersByGuild(guild)};

  return selectResponse(result, res);
})

app.post("/", async (req, res) => {
  if (typeof req.body.name != "string") {
    return res.sendStatus(400);
  }
  const result = await guildService.save(await createGuild(req.body.name));
  return saveResponse(result, res);
})

app.post("/:guildId/members/:userId", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.userId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const user = await userService.findById(parseInt(req.params.userId));
  if (!isGuild(guild) || !isUser(user)) {
    return res.status(400).send({guild: guild, user: user});
  }

  const result = await guildService.joinGuild(guild, user);
  return saveResponse(result, res);
})

app.get("/:guildId/raids", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if (!isGuild(guild)) {
    return res.status(400).send({guild: guild});
  }

  const results = await raidService.findByGuild(guild);
  if (results instanceof Array) {
    const asd = await Promise.all(results.map(async (result) => {
      if (typeof result == "string") return;
      return await raidToRaidForm(result);
    }));
    return selectResponse(asd, res);
  }
  return selectResponse({guild: guild, raids: results}, res);
})

app.get("/:guildId/raids/:raidId", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.raidId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if (!isGuild(guild)) {
    return res.status(400).send({guild: guild});
  }

  const result = await raidService.findById(parseInt(req.params.raidId));
  return selectResponse(result, res);
})

app.post("/:guildId/raids/:contentId", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.contentId)) || typeof req.body.name != "string" || typeof req.body.appoinmentTime != "string") return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const content = await contentService.findById(parseInt(req.params.contentId));
  if (!isGuild(guild) || !isContent(content)) return res.sendStatus(400);

  const result = await raidService.saveByGuildAndContent(guild, content, req.body.name, req.body.appoinmentTime);

  return saveResponse(result, res);
})

app.get("/:guildId/raids/:raidId/members", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.raidId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const raid = await raidService.findById(parseInt(req.params.raidId));
  if (!isGuild(guild) || !isRaid(raid)) return res.sendStatus(400);

  const result = await raidService.findMembersByRaid(raid)
  return selectResponse({raid: raid, members: result}, res);
})


app.post("/:guildId/raids/:raidId/members/:userId", async (req, res) => {
  if (isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.raidId)) || isNaN(parseInt(req.params.userId)) || typeof req.body.character != "string") return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const raid = await raidService.findById(parseInt(req.params.raidId));
  const user = await userService.findById(parseInt(req.params.userId));
  if (!isGuild(guild) || !isRaid(raid) || !isUser(user)) return res.sendStatus(400);

  const result = await raidService.joinRaid(raid, user, req.body.character);
  return saveResponse(result, res);
})


export default app;