
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { ClientledgerBatchMutations } from './ClientledgerBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddClientledger, UpdateClientledger } from './ClientledgerDbGateway';

export async function GET(request) {

  try {
    const { searchParams } = new URL(request.url);

    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(request);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canSelect = validateRoleAccess({
      table: 'clients',
      source: 'Clientledger',
      action : 'select',
      role: 'view_clients',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // clients column DictionaryMap
  const ClientledgerColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    clientName : "client_name", 
    phoneNumber : "phone_number", 
    email : "email", 
    nationalId : "national_id", 
    createdAt : "created_at", 
    industry : "industry", 
    referralSource : "referral_source", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `clients`,
      recordIdColumn: `record_id`,
      dictionary: ClientledgerColumnDictionary,
      searchParams,
      authData,
      batchMutations: ClientledgerBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Clientledger data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Clientledger failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ClientledgerRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ClientledgerRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ClientledgerRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ClientledgerRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ClientledgerRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canPost = validateRoleAccess({
      table: 'clients',
      source: 'Clientledger',
      action : 'create',
      role: 'manage_clients',
      authData
    });

    if (!canPost.valid) {
      return Response.json({
        status: 'error',
        message: canPost.message,
        data: []
      });
    }
    
    //generate Record id 
    const newId = magicRandomStr(7);

		
  
  //--- Begin  clients inputs array ---// 
  const ClientledgerInputsArr = {

    "client_name" : "?", 
    "phone_number" : "?", 
    "email" : "?", 
    "national_id" : "?", 
    "created_at" : "?", 
    "industry" : "?", 
    "referral_source" : "?", 

  };

  //--- End clients inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('clients',ClientledgerInputsArr, ClientledgerRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Clientledger
      const result = await AddClientledger(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        clients_dataNode: result.record_id
      });
      
    
 
  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}

export async function PUT(ClientledgerRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ClientledgerRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ClientledgerRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ClientledgerRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ClientledgerRequest);
     
    if (!isTokenValid) {
      return Response.json(
        { status: 'unauthorized', message: tokenError },
        { status: 403 }
      );
    }
    
    // -----------------------------
    // SIMPLE ROLE VALIDATION
    // -----------------------------
    const canUpdate = validateRoleAccess({
      table: 'clients',
      source: 'Clientledger',
      action : 'update',
      role: 'manage_clients',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const ClientledgerFormAction = body.clients_mosy_action;
    const clients_dataNode_value = base64Decode(body.clients_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  clients inputs array ---// 
  const ClientledgerInputsArr = {

    "client_name" : "?", 
    "phone_number" : "?", 
    "email" : "?", 
    "national_id" : "?", 
    "created_at" : "?", 
    "industry" : "?", 
    "referral_source" : "?", 

  };

  //--- End clients inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('clients',ClientledgerInputsArr, ClientledgerRequest, newId, authData)
       
      // update table Clientledger
      const result = await UpdateClientledger(newId, mutatedDataArray, body, authData, `primkey='${clients_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        clients_dataNode: clients_dataNode_value
      });
 

  } catch (err) {
    console.error(`Request failed:`, err);
    return Response.json(
      { status: 'error', 
      message: `Data Post error ${err.message}` },
      { status: 500 }
    );
  }
}


