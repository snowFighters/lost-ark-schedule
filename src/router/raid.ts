import express from "express";
import raidService from "../service/raid.js";
import {isRaidCreate} from "../domain/Raid.js";
import guildService from "../service/guild.js";
import userService from "../service/user.js";
import {asdasd} from "../util/scheduleJob.js";

const router = express.Router();

router.get("/:raidId", async (req, res) => {
  if (isNaN(parseInt(req.params.raidId))) return res.sendStatus(400);
  
  const result = await raidService.findById(parseInt(req.params.raidId));
  if (!result) return res.sendStatus(400);
  return res.send(result);
})

router.get("/:raidId/members", async (req, res) => {
  if (isNaN(parseInt(req.params.raidId))) return res.sendStatus(400);
  const raid = await raidService.findById(parseInt(req.params.raidId));
  if (!raid) return res.sendStatus(400);
  const result = await raidService.findMembersByRaid(raid);
  if (!result) return res.sendStatus(500);
  return res.send(result);
})


router.post("/", async (req, res) => {
  if (!isRaidCreate(req.body)) return res.sendStatus(400);
  const guild = await guildService.findById(req.body.guildId);
  if (!guild) return res.sendStatus(400);
  const result = await raidService.save(req.body);
  
  if (!result) return res.sendStatus(500);
  asdasd(result.insertId);
  return res.send({insertId: result.insertId});
})

router.post("/:raidId/members", async (req, res) => {
  if (isNaN(req.body.memberId) || typeof req.body.character != 'string' || isNaN(req.body.role)) return res.sendStatus(400);
  
  const raid = await raidService.findById(parseInt(req.params.raidId));
  const member = await userService.findById(req.body.memberId);
  if (raid == null || member == null) return res.sendStatus(400);
  const result = await raidService.joinRaid(raid, member, req.body.character, req.body.role);
  if (!result) return res.sendStatus(500);
  
  return res.send("OK");
})

router.put("/:raidId", async (req, res) => {
  if (!isRaidCreate(req.body)) return res.sendStatus(400);
  const raid = await raidService.findById(parseInt(req.params.raidId));
  if (raid == null) return res.sendStatus(400);
  
  const result = await raidService.updateById(raid.id, req.body);
  
  if(!result) return res.sendStatus(500);
  return res.send(200);
})

router.delete("/:raidId", async (req, res) => {
  const result = await raidService.deleteById(parseInt(req.params.raidId));
  res.send({insertId: result});
})


router.delete("/:raidId/users/:userId", async (req, res) => {
  const result = await raidService.exitRaid(parseInt(req.params.raidId), parseInt(req.params.userId), req.body.character);
  res.send({insertId: result});
})

export default router;

