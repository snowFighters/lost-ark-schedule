import express from "express";
import {createGuild} from "../uitl/createGuild.js";
import {saveResponse, selectResponse} from "../uitl/saveResponse.js";

import {Guild, isGuild} from "../domain/Guild.js";

import guildService from "../service/guild.js";
import guild from "../service/guild.js";
import userService from "../service/user.js";
import {isUser} from "../domain/User.js";


const app = express.Router();
app.get("/", (req, res) => {
  return res.send("OK");
})

app.get("/:code", async (req, res) => {
  const result = await guildService.findByCode(req.params.code);
  return selectResponse(result, res);
})

app.get("/:guildId/members/", async (req, res) => {
  if(isNaN(parseInt(req.params.guildId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  if(!isGuild(guild)){
    return res.status(400).send({guild:guild});
  }

  const result = {guild:guild, member: await guildService.findMembersByGuild(guild)};

  return selectResponse(result, res);
})

app.post("/", async (req, res) => {
  if(typeof req.body.name != "string"){
    return res.sendStatus(400);
  }
  const result = await guildService.save(await createGuild(req.body.name));
  return saveResponse(result, res);
})

app.post("/:guildId/members/:userId", async (req, res) => {
  if(isNaN(parseInt(req.params.guildId)) || isNaN(parseInt(req.params.userId))) return res.sendStatus(400);

  const guild = await guildService.findById(parseInt(req.params.guildId));
  const user = await userService.findById(parseInt(req.params.userId));
  if(!isGuild(guild) || !isUser(user)){
    return res.status(400).send({guild:guild, user:user});
  }

  const result = await guildService.joinGuild(guild, user);
  return saveResponse(result, res);
})

export default app;