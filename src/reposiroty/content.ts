import {connection} from "../config/dbconfig.js";
import {RowDataPacket} from "mysql2";
import {Content} from "../domain/content.js";


interface ContentRow extends RowDataPacket {
  id: number,
  name: string,
  max_member: number,
  type: number
}

function contentRowToContent(obj: ContentRow) {
  if (typeof obj == "undefined")
    return "There is no object";
  return {
    id: obj.id,
    name: obj.name,
    maxMember: obj.max_member,
    type: obj.type
  } as Content
}

async function findById(id: number) {
  const query = "SELECT * FROM content WHERE id = ?";
  try {
    const [[result]] = await connection.query<[ContentRow]>(query, [id]);
    return contentRowToContent(result);
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

const contentRepository = {findById}
export default contentRepository