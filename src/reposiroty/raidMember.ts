import {Raid} from "../domain/Raid.js";
import {User} from "../domain/User.js";
import {connection} from "../config/dbconfig.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Guild} from "../domain/Guild.js";

async function save(raid: Raid, user:User, character:string){
  const query = "INSERT INTO raid_member VALUES (NULL, ?, ?, ?)"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raid.id, user.id, character]);
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
async function findByRaid(raid: Raid) {
  const query = "SELECT user_id FROM raid_member WHERE raid_id = ?"
  try {
    const [resultList] = await connection.query<RowDataPacket[]>(query, [raid.id]);
    return resultList.map((result) => result.user_id as number)
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

const raidMemberRepository = {save, findByRaid};

export default raidMemberRepository;