
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { ProjectstepslistBatchMutations } from './ProjectstepslistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddProjectstepslist, UpdateProjectstepslist } from './ProjectstepslistDbGateway';

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
      table: 'project_steps',
      source: 'Projectstepslist',
      action : 'select',
      role: 'view_project_steps',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // project_steps column DictionaryMap
  const ProjectstepslistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    projectId : "project_id", 
    stepName : "step_name", 
    stepStatus : "step_status", 
    stepOrder : "step_order", 
    notes : "notes", 
    createdAt : "created_at", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `project_steps`,
      recordIdColumn: `record_id`,
      dictionary: ProjectstepslistColumnDictionary,
      searchParams,
      authData,
      batchMutations: ProjectstepslistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Projectstepslist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Projectstepslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ProjectstepslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ProjectstepslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ProjectstepslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ProjectstepslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ProjectstepslistRequest);
     
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
      table: 'project_steps',
      source: 'Projectstepslist',
      action : 'create',
      role: 'manage_project_steps',
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

		
  
  //--- Begin  project_steps inputs array ---// 
  const ProjectstepslistInputsArr = {

    "project_id" : "?", 
    "step_name" : "?", 
    "step_status" : "?", 
    "step_order" : "?", 
    "notes" : "?", 
    "created_at" : "?", 

  };

  //--- End project_steps inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('project_steps',ProjectstepslistInputsArr, ProjectstepslistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Projectstepslist
      const result = await AddProjectstepslist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        project_steps_dataNode: result.record_id
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

export async function PUT(ProjectstepslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ProjectstepslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ProjectstepslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ProjectstepslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ProjectstepslistRequest);
     
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
      table: 'project_steps',
      source: 'Projectstepslist',
      action : 'update',
      role: 'manage_project_steps',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const ProjectstepslistFormAction = body.project_steps_mosy_action;
    const project_steps_dataNode_value = base64Decode(body.project_steps_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  project_steps inputs array ---// 
  const ProjectstepslistInputsArr = {

    "project_id" : "?", 
    "step_name" : "?", 
    "step_status" : "?", 
    "step_order" : "?", 
    "notes" : "?", 
    "created_at" : "?", 

  };

  //--- End project_steps inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('project_steps',ProjectstepslistInputsArr, ProjectstepslistRequest, newId, authData)
       
      // update table Projectstepslist
      const result = await UpdateProjectstepslist(newId, mutatedDataArray, body, authData, `primkey='${project_steps_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        project_steps_dataNode: project_steps_dataNode_value
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


