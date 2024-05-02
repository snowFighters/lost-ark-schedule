import express from "express";
import {saveResponse, selectResponse} from "../util/saveResponse.js";
import {User, isUser} from "../domain/User.js";
import userService from "../service/user.js";
import raidService from "../service/raid.js";

const router = express.Router();
router.get("/", async (req, res) => {
  if(typeof (req.query.email) == "string"){
    const result = await userService.findByEmail(req.query.email);
    return selectResponse(result, res);
  }
  res.send("OK");
})
router.get("/:id", async (req, res) => {
  if(isNaN(parseInt(req.params.id))){
    return  res.sendStatus(400);
  }
  const result = await userService.findById(parseInt(req.params.id));
  return selectResponse(result, res);
})
router.get("/:userId/guilds", async (req, res) => {
  if(isNaN((parseInt(req.params.userId)))) return res.sendStatus(400);

  const user = await userService.findById(parseInt(req.params.userId));

  if(!isUser(user)) return selectResponse(user, res);

  const result = await userService.findGuildByUser(user);

  return selectResponse(result, res);

})

router.get("/:userId/raids", async (req, res) => {
  if(isNaN((parseInt(req.params.userId)))) return res.sendStatus(400);
  
  const user = await userService.findById(parseInt(req.params.userId));
  if(!isUser(user)) return selectResponse(user, res);
  
  const result = await raidService.findRaidByUserId(user.id);
  
  return selectResponse(result, res);
})

router.post("/", async (req, res) => {
  if(!isUser(req.body)) return res.sendStatus(400);
  const result = await userService.save(req.body);
  return saveResponse(result, res);
})

export default router;