
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { PaymentslistBatchMutations } from './PaymentslistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddPaymentslist, UpdatePaymentslist } from './PaymentslistDbGateway';

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
      table: 'payments',
      source: 'Paymentslist',
      action : 'select',
      role: 'view_payments',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // payments column DictionaryMap
  const PaymentslistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    projectId : "project_id", 
    clientId : "client_id", 
    amount : "amount", 
    paymentMethod : "payment_method", 
    transactionCode : "transaction_code", 
    payerName : "payer_name", 
    payerPhone : "payer_phone", 
    status : "status", 
    paidAt : "paid_at", 
    createdAt : "created_at", 
    billRefNo : "bill_ref_no", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `payments`,
      recordIdColumn: `record_id`,
      dictionary: PaymentslistColumnDictionary,
      searchParams,
      authData,
      batchMutations: PaymentslistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Paymentslist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Paymentslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(PaymentslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PaymentslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PaymentslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PaymentslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PaymentslistRequest);
     
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
      table: 'payments',
      source: 'Paymentslist',
      action : 'create',
      role: 'manage_payments',
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

		
  
  //--- Begin  payments inputs array ---// 
  const PaymentslistInputsArr = {

    "project_id" : "?", 
    "client_id" : "?", 
    "amount" : "?", 
    "payment_method" : "?", 
    "transaction_code" : "?", 
    "payer_name" : "?", 
    "payer_phone" : "?", 
    "status" : "?", 
    "paid_at" : "?", 
    "created_at" : "?", 
    "bill_ref_no" : "?", 

  };

  //--- End payments inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('payments',PaymentslistInputsArr, PaymentslistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Paymentslist
      const result = await AddPaymentslist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        payments_dataNode: result.record_id
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

export async function PUT(PaymentslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = PaymentslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await PaymentslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await PaymentslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(PaymentslistRequest);
     
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
      table: 'payments',
      source: 'Paymentslist',
      action : 'update',
      role: 'manage_payments',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const PaymentslistFormAction = body.payments_mosy_action;
    const payments_dataNode_value = base64Decode(body.payments_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  payments inputs array ---// 
  const PaymentslistInputsArr = {

    "project_id" : "?", 
    "client_id" : "?", 
    "amount" : "?", 
    "payment_method" : "?", 
    "transaction_code" : "?", 
    "payer_name" : "?", 
    "payer_phone" : "?", 
    "status" : "?", 
    "paid_at" : "?", 
    "created_at" : "?", 
    "bill_ref_no" : "?", 

  };

  //--- End payments inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('payments',PaymentslistInputsArr, PaymentslistRequest, newId, authData)
       
      // update table Paymentslist
      const result = await UpdatePaymentslist(newId, mutatedDataArray, body, authData, `primkey='${payments_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        payments_dataNode: payments_dataNode_value
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


