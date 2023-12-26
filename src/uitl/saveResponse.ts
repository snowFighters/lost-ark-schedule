import express from "express";
export function saveResponse(obj:any, response:express.Response){
  if(typeof obj == null){
    return response.status(500);
  }
  else if (typeof obj == "string"){
    return response.status(400).send(obj);
  }else if (typeof obj == "number"){
    return response.send({insertId:obj});
  }
  return response;
}

export function selectResponse(obj:any, response:express.Response){
  if(typeof obj == null){
    return response.status(500);
  }
  else if (typeof obj == "string"){
    return response.status(400).send(obj);
  }else if (typeof obj == "object"){
    return response.send(obj);
  }
  return response;
}