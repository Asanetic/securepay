
import { mosySqlDelete  , mosySqlInsert , mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

//insert clients 
export async function AddClientledger(newId, mutatedDataArray, body, authData)
{

  const result = await mosySqlInsert("clients", mutatedDataArray, body);
   
  return result;
}


//update clients 
export async function UpdateClientledger(newId, mutatedDataArray, body, authData, whereStr)
{

  const result = await mosySqlUpdate("clients", mutatedDataArray, body, whereStr);
  
  return result;
}


//delete clients 
export async function DeleteClientledger(tokenId, whereStr)
{  
  const result = await mosySqlDelete("clients", whereStr);

  return result;
}

