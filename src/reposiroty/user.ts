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
    return null;
  return{
    id:obj.id,
    email:obj.email,
    password:obj.password,
    characterName:obj.character_name
  }as User
}

async function save(user: User) {
  const query = "INSERT INTO user VALUES (NULL, ?)";
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [[user.email, user.password, user.characterName]]);
    return result.insertId;
  } catch (e) {
    console.log(e);
    return null;
  }
}

async function findById(id:number){
  const query = "SELECT * FROM user WHERE id = ?";
  try {
    const [[result]] = await connection.query<[UserRow]>(query, [id]);
    return userRowToUser(result);
  }catch (e) {
    console.log(e);
    return null;
  }
}
async function findByEmail(email:string){
  const query = "SELECT * FROM user WHERE email = ?";
  try {
    const [[result]] = await connection.query<[UserRow]>(query, [email]);
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
  const query = "SELECT * FROM user WHERE id IN (?)";
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

async function updateCharacterNameById(id:number, characterName:string){
  const query = "UPDATE user SET character_name = ? WHERE id = ?"
  try {
    const [result] = await connection.query<ResultSetHeader>(query, [characterName, id]);
    return result.insertId
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


const userRepository = {save, findById, findByIdList, findByEmail, updateCharacterNameById};
export default userRepository;