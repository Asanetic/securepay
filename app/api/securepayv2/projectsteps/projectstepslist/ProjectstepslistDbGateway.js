
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert project_steps 
export async function AddProjectstepslist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("project_steps", mutatedDataArray, body);
   
  return result;
}


//update project_steps 
export async function UpdateProjectstepslist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("project_steps", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete project_steps 
export async function DeleteProjectstepslist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("project_steps", whereStr);

  return result;
}

