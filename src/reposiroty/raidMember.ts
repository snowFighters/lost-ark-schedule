import {Raid} from "../domain/Raid.js";
import {User} from "../domain/User.js";
import {connection} from "../config/dbconfig.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Guild} from "../domain/Guild.js";
import {UserCharacter} from "../domain/form/UserCharacter.js";
import {RaidCharacter} from "../domain/form/RaidCharacter";

interface UserCharacterForm extends RowDataPacket {
  user_id:number;
  character:string;
}

interface RaidCharacterForm extends RowDataPacket {
  raid_id:number;
  character:string;
}
function userCharacterConvert(obj:UserCharacterForm){
  return {
    userId:obj.user_id,
    character:obj.character
  } as UserCharacter;
}
function raidCharacterConvert(obj:RaidCharacterForm){
  return {
    raidId:obj.raid_id,
    character:obj.character
  } as RaidCharacter;
}

async function save(raid: Raid, user:User, character:string){
  const query = "INSERT INTO raid_member VALUES (NULL, ?, ?, ?)"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raid.id, user.id, character]);
    return result.insertId;
  } catch (e) {
    console.log(e);
    return null;
  }
}
async function findByRaid(raid: Raid) {
  const query = "SELECT user_id, `character` FROM raid_member WHERE raid_id = ?"
  try {
    const [resultList] = await connection.query<UserCharacterForm[]>(query, [raid.id]);
    return resultList.map((result) => {return userCharacterConvert(result)});
  } catch (e) {
    console.log(e);
    return null;
  }
}
async function findByUserId(userId: number) {
  const query = "SELECT raid_id, `character` FROM raid_member WHERE user_id = ?"
  try {
    const [resultList] = await connection.query<RaidCharacterForm[]>(query, [userId]);
    return resultList.map((result) => {return raidCharacterConvert(result)});
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if ("sqlMessage" in e && typeof e.sqlMessage === "string") {
        return e.sqlMessage;
      }
    }
    return null;
  }
}

async function deleteByIdAndUserAndCharacter(raidId:number, userId:number, character:string){
  const query = "DELETE FROM raid_member WHERE raid_id = ? AND user_id = ? AND `character` = ?;"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raidId, userId, character]);
    console.log(result);
    return result.insertId;
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      if ("sqlMessage" in e && typeof e.sqlMessage === "string") {
        return e.sqlMessage;
      }
    }
    return null;
  }
}

const raidMemberRepository = {save, findByRaid, deleteByIdAndUserAndCharacter, findByUserId};

export default raidMemberRepository;