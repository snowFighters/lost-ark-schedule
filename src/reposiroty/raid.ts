import {connection} from "../config/dbconfig.js";

import {Raid} from "../domain/Raid.js";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {Guild} from "../domain/Guild.js";

interface RaidRow extends RowDataPacket{
    id:number,
    guild_id:number,
    content_id:number,
    name:string,
    appoinment_time : string;
}

function RaidRowToRaid(obj:RaidRow) {
    if(typeof obj == "undefined")
        return "There is no object";
    return {
        id:obj.id,
        guildId:obj.guild_id,
        contentId:obj.content_id,
        name:obj.name,
        appoinmentTime : obj.appoinment_time,
    } as Raid;
}


async function save(raid:Raid){
    const query = "INSERT INTO raid VALUES (NULL,?, ?, ?, ?)";
    try{
        const [result] = await connection.query<ResultSetHeader>(query, [raid.guildId, raid.contentId, raid.name, raid.appoinmentTime]);
        return result.insertId;
    }catch (e) {
        console.log(e);
        if (e instanceof Error) {
            if ("sqlMessage" in e && typeof e.sqlMessage === "string") {
                return e.sqlMessage;
            }
        }
        return null;
    }
}



async function findById(id:number){
    const query = "SELECT * FROM raid WHERE id = ?";
    try {
        const [[result]] = await connection.query<[RaidRow]>(query, [id]);
        return RaidRowToRaid(result)
    }catch (e) {
        console.log(e);
        if (e instanceof Error) {
            if ("sqlMessage" in e && typeof e.sqlMessage === "string") {
                return e.sqlMessage;
            }
        }
        return null;
    }
}

async function findByGuild(guild:Guild){
    const query = "SELECT * FROM raid WHERE guild_id = ? ORDER BY appoinment_time";
    try {
        const [results] = await connection.query<RaidRow[]>(query, [guild.id]);
        return results.map((result) =>  {return  RaidRowToRaid(result)});
    }catch (e) {
        console.log(e);
        if (e instanceof Error) {
            if ("sqlMessage" in e && typeof e.sqlMessage === "string") {
                return e.sqlMessage;
            }
        }
        return null;
    }
}

const raidRepository = {save, findById, findByGuild};
export default raidRepository;