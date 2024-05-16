import express from "express";
import {saveResponse, selectResponse} from "../util/saveResponse.js";
import {User, isUser} from "../domain/User.js";
import userService from "../service/user.js";
import raidService from "../service/raid.js";
import * as url from "url";
import axios from "axios";
import userRepository from "../reposiroty/user.js";

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

  return selectResponse(result, res);
})

router.post("/", async (req, res) => {
  if (!isUser(req.body)) return res.sendStatus(400);
  if(await userService.findByEmail(req.body.email)) return res.sendStatus(400);
  const result = await userService.save(req.body);
  return saveResponse(result, res);
})

router.get("/api/auth/discord/redirect", async (req, res) => {
  const {code} = req.query;

  if (typeof code == "string") {
    const formData = new url.URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID,
      client_secret: process.env.DISCORD_CLIENT_SECRET,
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
        characterName:userInfoJson.global_name,
        password: userInfoJson.id
      } as User;
      const result = await userRepository.save(user);
    }
  }


  return res.sendStatus(200)

})

export default router;