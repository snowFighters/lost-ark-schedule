import contentRepository from "../reposiroty/content.js";

async function findById(id: number) {
  return await contentRepository.findById(id);
}


const contentService = {findById};

export default contentService;