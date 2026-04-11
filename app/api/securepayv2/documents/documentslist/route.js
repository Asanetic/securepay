
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { DocumentslistBatchMutations } from './DocumentslistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddDocumentslist, UpdateDocumentslist } from './DocumentslistDbGateway';

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
      table: 'documents',
      source: 'Documentslist',
      action : 'select',
      role: 'view_documents',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // documents column DictionaryMap
  const DocumentslistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    projectId : "project_id", 
    clientId : "client_id", 
    docType : "doc_type", 
    fileUrl : "file_url", 
    status : "status", 
    createdAt : "created_at", 
    documentName : "document_name", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `documents`,
      recordIdColumn: `record_id`,
      dictionary: DocumentslistColumnDictionary,
      searchParams,
      authData,
      batchMutations: DocumentslistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Documentslist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Documentslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(DocumentslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DocumentslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DocumentslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DocumentslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DocumentslistRequest);
     
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
      table: 'documents',
      source: 'Documentslist',
      action : 'create',
      role: 'manage_documents',
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

		
  
  //--- Begin  documents inputs array ---// 
  const DocumentslistInputsArr = {

    "project_id" : "?", 
    "client_id" : "?", 
    "doc_type" : "?", 
    "file_url" : "?", 
    "status" : "?", 
    "created_at" : "?", 
    "document_name" : "?", 

  };

  //--- End documents inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('documents',DocumentslistInputsArr, DocumentslistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Documentslist
      const result = await AddDocumentslist(newId, mutatedDataArray, body, authData);     

       
                // Now handle the file upload for file_url, if any
                if (body.filedocuments_file_url) {
                  if(body["filedocuments_file_url"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filedocuments_file_url"], "media/documents");
                    
                    DocumentslistInputsArr.file_url = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateDocumentslist(newId, { file_url: filePath }, body, authData,  `primkey='${result.record_id}'`)
                    
                    let fileToDelete = body.media_documents_file_url;
                      
                    //Delete file if need be

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        documents_dataNode: result.record_id
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

export async function PUT(DocumentslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = DocumentslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await DocumentslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await DocumentslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(DocumentslistRequest);
     
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
      table: 'documents',
      source: 'Documentslist',
      action : 'update',
      role: 'manage_documents',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const DocumentslistFormAction = body.documents_mosy_action;
    const documents_dataNode_value = base64Decode(body.documents_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  documents inputs array ---// 
  const DocumentslistInputsArr = {

    "project_id" : "?", 
    "client_id" : "?", 
    "doc_type" : "?", 
    "file_url" : "?", 
    "status" : "?", 
    "created_at" : "?", 
    "document_name" : "?", 

  };

  //--- End documents inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('documents',DocumentslistInputsArr, DocumentslistRequest, newId, authData)
       
      // update table Documentslist
      const result = await UpdateDocumentslist(newId, mutatedDataArray, body, authData, `primkey='${documents_dataNode_value}'`)

      
                // Now handle the file upload for file_url, if any
                if (body.filedocuments_file_url) {
                  if(body["filedocuments_file_url"].size>0){
                  try {
                    
                    const filePath = await mosyUploadFile(body[ "filedocuments_file_url"], "media/documents");
                    
                    DocumentslistInputsArr.file_url = filePath; // Update file path in the database

                    // After file upload, update the database with the file path
                    await UpdateDocumentslist(newId, { file_url: filePath }, body, authData,  `primkey='${documents_dataNode_value}'`)
                    
                    let fileToDelete = body.media_documents_file_url;
                      
                    //Delete old file
mosyDeleteFile(fileToDelete);
// Log or store deleted file: fileToDelete

                  } catch (fileErr) {
                    console.error("File upload failed:", fileErr);
                    // You can either handle this error or return a partial success message
                  }
                }
               }

      return Response.json({
        status: 'success',
        message: result.message,
        documents_dataNode: documents_dataNode_value
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


