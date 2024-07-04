import express from "express";
import {saveResponse, selectResponse} from "../util/saveResponse.js";
import {User, isUser} from "../domain/User.js";
import userService from "../service/user.js";
import raidService from "../service/raid.js";
import * as url from "url";
import axios from "axios";
import userRepository from "../reposiroty/user.js";
import guildService from "../service/guild.js";
import contentService from "../service/content.js";

const router = express.Router();
router.get("/", async (req, res) => {
  if (typeof (req.query.email) == "string") {
    const result = await userService.findByEmail(req.query.email);
    return selectResponse(result, res);
  }
  res.send("OK");
})
router.get("/:id", async (req, res) => {
  if (isNaN(parseInt(req.params.id))) {
    return res.sendStatus(400);
  }
  const result = await userService.findById(parseInt(req.params.id));
  return selectResponse(result, res);
})
router.get("/:userId/guilds", async (req, res) => {
  if (isNaN((parseInt(req.params.userId)))) return res.sendStatus(400);

  const user = await userService.findById(parseInt(req.params.userId));

  if (!isUser(user)) return selectResponse(user, res);

  const result = await userService.findGuildByUser(user);

  return selectResponse(result, res);

})

router.get("/:userId/raids", async (req, res) => {
  if (isNaN((parseInt(req.params.userId)))) return res.sendStatus(400);

  const user = await userService.findById(parseInt(req.params.userId));
  if (!isUser(user)) return selectResponse(user, res);

  const result = await raidService.findRaidByUserId(user.id);
  if (result == null || typeof result == "string") return res.send(400);
  const b = [...new Set(result.map((x) => JSON.stringify(x))),].map((r) => JSON.parse(r))

  const a = await Promise.all(b.map(async (r) => {
    if (!r) return null;
    const guild = await guildService.findById(r.guildId);
    const counts = await raidService.readMemberCountByRaid(r);
    const content = await contentService.findById(r.contentId);
    return {...r, guild: guild, content, ...counts as any,};
  }));


  a.sort((a, b) => {
    return new Date(a.appoinmentTime).getTime() - new Date(b.appoinmentTime).getTime();
  });
  return res.send(a);
})

router.get("/:userId/character", async (req, res) => {
  if (isNaN((parseInt(req.params.userId)))) return res.sendStatus(400);

  const user = await userService.findById(parseInt(req.params.userId));
  if (!isUser(user)) return selectResponse(user, res);
  const result = await raidService.findRaidByUserId1(user.id);
  if (result == null || typeof result == "string") return res.send(400);

  const a = await Promise.all(result.map(async (r) => {
    if (!r) return null;
    const guild = await guildService.findById(r.guildId);
    const counts = await raidService.readMemberCountByRaid(r);
    const content = await contentService.findById(r.contentId);
    return {...r, guild: guild, content, ...counts as any,};
  }));

  const b = a.reduce((acc, cur) => {
    const index = acc.findIndex((item: any) => item.characterName == cur.characterName);
    if (index == -1) acc.push({characterName: cur.characterName, contents: [cur.contentId]});
    else acc[index].contents.push(cur.contentId)
    return acc;
  }, [])

  return res.send(b)
})

router.post("/", async (req, res) => {
  if (!isUser(req.body)) return res.sendStatus(400);
  if (await userService.findByEmail(req.body.email)) return res.sendStatus(400);
  const result = await userService.save(req.body);
  return saveResponse(result, res);
})

router.get("/api/auth/discord/redirect", async (req, res) => {
  const {code} = req.query;

  if (typeof code == "string") {
    const formData = new url.URLSearchParams({
      client_id: '1235505831538069554',
      client_secret: 'whI7EiNMhSqPoZfUBFNWolscdmOXEORX',
      grant_type: 'authorization_code',
      code: code.toString(),
      redirect_uri: "http://localhost:12312/users/api/auth/discord/redirect"
    } as Record<string, string>);

    const output = await fetch("https://discord.com/api/v10/oauth2/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData
    });
    const outputJson = await output.json()
    if (outputJson) {
      const access = outputJson.access_token;
      console.log(`Bearer ${access}`)
      const userInfo = await fetch("https://discord.com/api/v10/users/@me", {
        headers: {
          "Authorization": `Bearer ${access}`,
        }
      })
      const userInfoJson = await userInfo.json();
      console.log(outputJson);
      console.log(userInfoJson);

      const user = {
        email: userInfoJson.email,
        characterName: userInfoJson.global_name,
        password: userInfoJson.id
      } as User;
      // const result = await userRepository.save(user);
    }
  }


  return res.sendStatus(200)

})

export default router;