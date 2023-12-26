import {User} from "../domain/User.js";

import userRepository from "../reposiroty/user.js";

async function save(user:User){
  return await userRepository.save(user);
}
async function findById(id:number){
  return await userRepository.findById(id)
}


const userService = {save, findById};
export default userService;