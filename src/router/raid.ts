import express from "express";
import raidService from "../service/raid.js";

const router = express.Router();

router.get("/", async (req, res) => {
  res.send("OK");
})

router.delete("/:raidId", async (req, res) => {
  const result = await raidService.deleteById(parseInt(req.params.raidId));
  res.send({insertId:result});
})


router.delete("/:raidId/users/:userId", async (req, res) => {
  const result = await raidService.exitRaid(parseInt(req.params.raidId), parseInt(req.params.userId), req.body.character);
  res.send({insertId:result});
})

export default  router;

