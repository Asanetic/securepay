
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert projects 
export async function AddProjectslist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("projects", mutatedDataArray, body);
   
  return result;
}


//update projects 
export async function UpdateProjectslist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("projects", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete projects 
export async function DeleteProjectslist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("projects", whereStr);

  return result;
}

