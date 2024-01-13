export interface Content{
  id : number,
  name: string,
  maxMember: number,
  type: number
}

export function isContent(obj:any) : obj is Content{
  if(typeof obj.id != "number" || typeof obj.name != "string" || typeof obj.maxMember != "number" || typeof obj.type != "number") return  false;
  return true
}

