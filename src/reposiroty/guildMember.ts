import {connection} from "../config/dbconfig.js";
import {RowDataPacket, ResultSetHeader} from "mysql2";

import {Guild} from "../domain/Guild.js";
import {User} from "../domain/User.js";

async function save(guild: Guild, user: User) {
  const query = "INSERT INTO guild_member VALUES (NULL, ?, ?)"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [guild.id, user.id])
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function findByGuild(guild: Guild) {
  const query = "SELECT user_id FROM guild_member WHERE guild_id = ?"
  try {
    const [resultList] = await connection.query<RowDataPacket[]>(query, [guild.id]);
    return resultList.map((result) => result.user_id as number)
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function findByUser(user:User) {
  const query = "SELECT guild_id FROM guild_member WHERE user_id = ?"
  try {
    const [resultList] = await connection.query<RowDataPacket[]>(query, [user.id]);
    return resultList.map((result) => result.guild_id as number)
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

const guildMemberRepository = {save, findByGuild, findByUser};
export default guildMemberRepository;