import {Guild} from "../domain/Guild.js";
import {connection} from "../config/dbconfig.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";

interface GuildRow extends RowDataPacket {
  id:number,
  name:string,
  code:string,
}

function GuildRowToGuild(obj:GuildRow) {
  if(typeof obj == "undefined")
    return null;
  return{
    id:obj.id,
    name:obj.name,
    code:obj.code,
  } as Guild;
}

async function save(guild: Guild) {
  const query = "INSERT INTO guild VALUES (NULL, ?)";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [[guild.name, guild.code]]);
    return result;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function findById(id:number){
  const query = "SELECT * FROM guild WHERE id = ?";
  try {
    const [[result]] = await connection.query<[GuildRow]>(query, [id]);
    return GuildRowToGuild(result);
  } catch (e) {
    console.log(e);
    return null;
  }

}

async function findByCode(code:string){
  const query = "SELECT * FROM guild WHERE code = ?"
  try {
    const [[result]] = await connection.query<[GuildRow]>(query, [code]);
    return GuildRowToGuild(result);
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function findByIdList(idList : number[]){
  const query = "SELECT * FROM guild WHERE id in (?)"
  try {
    const [resultList] = await connection.query<GuildRow[]>(query, [idList]);
    return resultList.map(result =>  GuildRowToGuild(result));
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

const guildRepository = {save, findById, findByCode, findByIdList};
export default guildRepository;