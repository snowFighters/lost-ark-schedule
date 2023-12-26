import {connection} from "../config/dbconfig.js";
import {RowDataPacket, ResultSetHeader} from "mysql2";

import {isUser, User} from "../domain/User.js";

interface UserRow extends  RowDataPacket {
  id:number,
  email:string,
  password:string,
  character_name:string
}

function userRowToUser(obj:UserRow) {
  if(typeof obj == "undefined")
    return "There is no object";
  return{
    id:obj.id,
    email:obj.email,
    password:obj.password,
    characterName:obj.character_name
  }as User
}

async function save(user: User) {
  const query = "INSERT INTO USER VALUES (NULL, ?)";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [[user.email, user.password, user.characterName]]);
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

async function findById(id:number){
  const query = "SELECT * FROM USER WHERE id = ?";
  try {
    const [[result]] = await connection.query<[UserRow]>(query, [id]);
    return userRowToUser(result);
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

async function findByIdList(idList:number[]){
  const query = "SELECT * FROM USER WHERE id IN (?)";
  try {
    const [resultList] = await connection.query<[UserRow]>(query, [idList]);
    return resultList.map(result => userRowToUser(result))
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


const userRepository = {save, findById, findByIdList};
export default userRepository;