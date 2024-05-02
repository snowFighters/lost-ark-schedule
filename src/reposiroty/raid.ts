import {connection} from "../config/dbconfig.js";

import {Raid, RaidCreate} from "../domain/Raid.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Guild} from "../domain/Guild.js";

interface RaidRow extends RowDataPacket {
  id: number,
  guild_id: number,
  content_id: number,
  name: string,
  appoinment_time: string;
  is_regular: number;
}

function RaidRowToRaid(obj: RaidRow) {
  if (typeof obj == "undefined")
    return null;
  return {
    id: obj.id,
    guildId: obj.guild_id,
    contentId: obj.content_id,
    name: obj.name,
    appoinmentTime: obj.appoinment_time,
    isRegular: obj.is_regular
  } as Raid;
}


async function save(raid: RaidCreate) {
  const query = "INSERT INTO raid VALUES (NULL,?, ?, ?, ?, ?)";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raid.guildId, raid.contentId, raid.name, raid.appoinmentTime, raid.isRegular]);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}


async function findById(id: number) {
  const query = "SELECT * FROM raid WHERE id = ?";
  try {
    const [[result]] = await connection.query<[RaidRow]>(query, [id]);
    return RaidRowToRaid(result)
  } catch (e) {
    return null;
  }
}

async function findByGuild(guild: Guild) {
  const query = "SELECT * FROM raid WHERE guild_id = ? ORDER BY appoinment_time";
  try {
    const [results] = await connection.query<RaidRow[]>(query, [guild.id]);
    return results.map((result) => {
      return RaidRowToRaid(result)
    }).filter((result): result is Raid => result != null);
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function updateById(id: number, raid: RaidCreate) {
  const query = "UPDATE raid SET content_id = ?, name = ?, appoinment_time = ?, is_regular = ? WHERE id = ?"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raid.contentId, raid.name, raid.appoinmentTime, raid.isRegular, id]);
    return result
  } catch (e) {
    console.log(e)
    return null;
  }
}

async function deleteById(raidId: number) {
  const query = "DELETE FROM raid WHERE id = ?;"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [raidId]);
    console.log(result);
    return result.insertId;
  } catch (e) {
    console.log(e);
    return null;
  }
}

const raidRepository = {save, findById, findByGuild, updateById, deleteById};
export default raidRepository;