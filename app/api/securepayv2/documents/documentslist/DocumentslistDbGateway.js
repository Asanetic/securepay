
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert documents 
export async function AddDocumentslist(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("documents", mutatedDataArray, body);
   
  return result;
}


//update documents 
export async function UpdateDocumentslist(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("documents", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete documents 
export async function DeleteDocumentslist(tokenId, whereStr)
{  
  const result = await mosySqlDelete("documents", whereStr);

  return result;
}

