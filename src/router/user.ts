import express from "express";
import {saveResponse, selectResponse} from "../uitl/saveResponse.js";
import {User, isUser} from "../domain/User.js";
import userService from "../service/user.js";



const router = express.Router();
router.get("/", async (req, res) => {
  res.send("OK");
})
router.get("/:id", async (req, res) => {
  if(isNaN(parseInt(req.params.id))){
    return  res.sendStatus(400);
  }
  const result = await userService.findById(parseInt(req.params.id));
  return selectResponse(result, res);
})

router.post("/", async (req, res) => {
  if(!isUser(req.body)) return res.sendStatus(400);
  const result = await userService.save(req.body);
  return saveResponse(result, res);
})

export default router
