export interface Guild{
  id:number,
  name:string,
  code:string,
}

export function isGuild(obj:any): obj is Guild{
  if(typeof obj.name != "string") return false
  else if (typeof obj.code != "string") return false
  return true;
}

