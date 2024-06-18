import {Raid} from "../domain/Raid.js";
import {User} from "../domain/User.js";
import {connection} from "../config/dbconfig.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Guild} from "../domain/Guild.js";
import {UserCharacter} from "../domain/form/UserCharacter.js";
import {RaidCharacter} from "../domain/form/RaidCharacter";
import getWednesday from "../util/getWendsday.js";

interface UserCharacterForm extends RowDataPacket {
  user_id:number;
  character:string;
  role:number
}

interface RaidCharacterForm extends RowDataPacket {
  raid_id:number;
  character:string;
  role:number

}
function userCharacterConvert(obj:UserCharacterForm){
  return {
    userId:obj.user_id,
    character:obj.character,
    role:obj.role
  } as UserCharacter;
}
function raidCharacterConvert(obj:RaidCharacterForm){
  return {
    raidId:obj.raid_id,
    character:obj.character,
    role:obj.role
  } as RaidCharacter;
}

async function save(raid: Raid, user:User, character:string, role:number){
  const query = "INSERT INTO raid_member VALUES (NULL, ?, ?, ?, ?)"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raid.id, user.id, character, role]);
    return result.insertId;
  } catch (e) {
    console.log(e);
    return null;
  }
}
async function findByRaid(raid: Raid) {
  const query = "SELECT user_id, `character`, role FROM raid_member WHERE raid_id = ?"
  try {
    const [resultList] = await connection.query<UserCharacterForm[]>(query, [raid.id]);
    return resultList.map((result) => {return userCharacterConvert(result)});
  } catch (e) {
    console.log(e);
    return null;
  }
}
async function findByUserId(userId: number) {
  const next = getWednesday.nextWednesday(new Date());
  const prev = getWednesday.previousWednesday(new Date());
  console.log(`prev: ${prev}, next:${next}`);
  const query = " SELECT raid_id, `character`, role FROM raid_member a JOIN raid r ON r.id = a.raid_id AND appoinment_time >= ? and appoinment_time < ? WHERE user_id = ? ; "
 
  try {
    const [resultList] = await connection.query<RaidCharacterForm[]>(query, [prev, next, userId]);
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

async function findMemberCountByRaid(raid:Raid){
  const query = "SELECT COUNT(case when `ROLE` = 0 then 1 end) AS dealer,COUNT(case when `ROLE` = 1 then 1 end) AS support  FROM raid_member WHERE raid_id = ?; "
  try {
    const [[result]] = await connection.query<RowDataPacket[]>(query, [raid.id]);
    return result;
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

const raidMemberRepository = {save, findByRaid, deleteByIdAndUserAndCharacter, findByUserId, findMemberCountByRaid};

export default raidMemberRepository;