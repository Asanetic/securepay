
//utils 
import {base64Decode, mosyUploadFile, mosyDeleteFile, magicRandomStr , mosySecureSelect} from '../../../apiUtils/dataControl/dataUtils';

import { ProjectslistBatchMutations } from './ProjectslistBatchMutations';

//be gate keeper and auth 
import { mosyMutateQuery, mutateInputArray } from '../../beMonitor';

//role access control 
import { validateRoleAccess } from '../../validateRoleAccess';

import { processAuthToken } from '../../../auth/authManager';

import { AddProjectslist, UpdateProjectslist } from './ProjectslistDbGateway';

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
      table: 'projects',
      source: 'Projectslist',
      action : 'select',
      role: 'view_projects',
      authData
    });

    if (!canSelect.valid) {
      return Response.json({
        status: 'error',
        message: canSelect.message,
        data: []
      });
    }

    
    // projects column DictionaryMap
  const ProjectslistColumnDictionary={

    Node : "primkey", 
    NodeId : "record_id", 
    clientId : "client_id", 
    contractor : "contractor", 
    projectName : "project_name", 
    amount : "amount", 
    currency : "currency", 
    status : "status", 
    progressPercent : "progress_percent", 
    createdAt : "created_at", 
    projectRef : "project_ref", 

  }


    
    
    
    
   const result = await mosySecureSelect({
      table: `projects`,
      recordIdColumn: `record_id`,
      dictionary: ProjectslistColumnDictionary,
      searchParams,
      authData,
      batchMutations: ProjectslistBatchMutations,
      defaultOrderColumn : `primkey`
    });

    return Response.json({
      status: 'success',
      message: 'Projectslist data retrieved',
      ...result
    });
      
   
  } catch (err) {
    console.error('GET Projectslist failed:', err);
    return Response.json(
      { status: 'error', message: err.message },
      { status: 500 }
    );
  }
}



export async function POST(ProjectslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ProjectslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ProjectslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ProjectslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ProjectslistRequest);
     
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
      table: 'projects',
      source: 'Projectslist',
      action : 'create',
      role: 'manage_projects',
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

		
  
  //--- Begin  projects inputs array ---// 
  const ProjectslistInputsArr = {

    "client_id" : "?", 
    "contractor" : "?", 
    "project_name" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "status" : "?", 
    "progress_percent" : "?", 
    "created_at" : "?", 
    "project_ref" : "?", 

  };

  //--- End projects inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('projects',ProjectslistInputsArr, ProjectslistRequest, newId, authData)

      
      mutatedDataArray.record_id = newId;
      
      // Insert into table Projectslist
      const result = await AddProjectslist(newId, mutatedDataArray, body, authData);     

       

      return Response.json({
        status: 'success',
        message: result.message,
        projects_dataNode: result.record_id
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

export async function PUT(ProjectslistRequest) {
  try {
    let body;
    let isMultipart = false;

    const contentType = ProjectslistRequest.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      isMultipart = true;
      const formData = await ProjectslistRequest.formData();

      // Convert FormData to plain object
      body = {};
      for (let [key, value] of formData.entries()) {
        body[key] = value;
      }

    } else {
      body = await ProjectslistRequest.json();
    }
    
    
    const { valid: isTokenValid, reason: tokenError, data: authData } = processAuthToken(ProjectslistRequest);
     
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
      table: 'projects',
      source: 'Projectslist',
      action : 'update',
      role: 'manage_projects',
      authData
    });

    if (!canUpdate.valid) {
      return Response.json({
        status: 'error',
        message: canUpdate.message,
        data: []
      });
    }
    
    const ProjectslistFormAction = body.projects_mosy_action;
    const projects_dataNode_value = base64Decode(body.projects_dataNode);
    
    const newId = magicRandomStr(7);

		
  
  //--- Begin  projects inputs array ---// 
  const ProjectslistInputsArr = {

    "client_id" : "?", 
    "contractor" : "?", 
    "project_name" : "?", 
    "amount" : "?", 
    "currency" : "?", 
    "status" : "?", 
    "progress_percent" : "?", 
    "created_at" : "?", 
    "project_ref" : "?", 

  };

  //--- End projects inputs array --//

    //mutate requested values eg add authData.hive_site_id or add more values that only the back end control etc 
    const mutatedDataArray =mutateInputArray('projects',ProjectslistInputsArr, ProjectslistRequest, newId, authData)
       
      // update table Projectslist
      const result = await UpdateProjectslist(newId, mutatedDataArray, body, authData, `primkey='${projects_dataNode_value}'`)

      

      return Response.json({
        status: 'success',
        message: result.message,
        projects_dataNode: projects_dataNode_value
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


