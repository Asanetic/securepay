'use client';
//hive / data utils
import { mosyPostFormData, mosyGetData, mosyUrlParam, mosyUpdateUrlParam , deleteUrlParam, magicRandomStr, mosyGetLSData  } from '../../../MosyUtils/hiveUtils';

//action modals 
import { MosyNotify , closeMosyModal, MosyAlertCard } from '../../../MosyUtils/ActionModals';

//filter util
import { MosySecureFilterEngine } from '../../DataControl/MosyFilterEngine';

//custom event manager 
import { customEventHandler } from '../../DataControl/customDataFunction';

//routes manager
///handle routes 
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();

//insert data
export async function insertProjectslist() {
 //console.log(`Form projects insert sent `)

  return await mosyPostFormData({
    formId: 'projects_profile_form',
    url: apiRoutes.projectslist.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateProjectslist() {

  //console.log(`Form projects update sent `)

  return await mosyPostFormData({
    formId: 'projects_profile_form',
    url: apiRoutes.projectslist.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateProjectslistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('projects_mosy_action');
 
 //console.log(`Form projects submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_projects') {

      actionMessage ='Record added succesfully!';

      result = await insertProjectslist();
    }

    if (actionType === 'update_projects') {

      actionMessage ='Record updated succesfully!';

      result = await updateProjectslist();
    }

    if (result?.status === 'success') {
      
      const projectsUptoken = btoa(result.projects_dataNode || '');

      //set id key
      setters.setProjectslistUptoken(projectsUptoken);
      
      //update url with new projectsUptoken
      mosyUpdateUrlParam('projects_dataNode', projectsUptoken)

      setters.setProjectslistActionStatus('update_projects')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: projectsUptoken,
        actionName : actionType,
        actionType : 'projects_form_submission'
      };
            
      
    } else {
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
      
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
    }

  } catch (error) {
    console.error('Form error:', error);
    
      MosyNotify({message:result.message, icon:'times-circle', iconColor :'text-danger'})
    
      return {
        status: 'error',
        message: result,
        actionName: actionType,
        newToken: null
      };
      
  } 
}


export async function initProjectslistProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Projects list' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.projectslist.base,
      params: { 
      ...rawQstr,
      src : btoa(`initProjectslistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('projects Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching projects data:', response.message);  // Handle error
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

      closeMosyModal()

      return {}
    }
  } catch (err) {

    closeMosyModal()

    console.log('Error:', err);
    return {}
  }
}


export async function DeleteProjectslist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.projectslist.delete,
        params: { 
          _projects_delete_record: (token), 
          },
      });

      console.log('Token DeleteProjectslist '+token)
      if (response.status === 'success') {

        closeMosyModal();

        return response; // Return the data
      } else {
        console.error('Error deleting systemusers data:', response.message);
        
        closeMosyModal();

        MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})

        return response; // Safe fallback
      }
    } catch (err) {
      console.error('Error:', err);
      closeMosyModal();
      
      return []; //  Even safer fallback
    }

}


export async function getProjectslistListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qprojects_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.projectslist.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getProjectslistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('projects Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching projects data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadProjectslistListData(customQueryStr, setters) {

    const gftProjectslist = MosySecureFilterEngine('projects');
    let finalFilterStr = (gftProjectslist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setProjectslistLoading(true);
    
    const projectslistListData = await getProjectslistListData(finalFilterStr);
    
    setters.setProjectslistLoading(false)
    setters.setProjectslistListData(projectslistListData?.data)

    setters.setProjectslistListPageCount(projectslistListData?.pagination?.page_count)


    return projectslistListData

}
  
  
export async function projectslistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const projectslistTokenId = mosyUrlParam('projects_dataNode');
    
    const deleteParam = mosyUrlParam('projects_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedProjectslistToken = '0';
    if (projectslistTokenId) {
      
      decodedProjectslistToken = atob(projectslistTokenId); // Decode the record_id
      setters.setProjectslistUptoken(projectslistTokenId);
      setters.setProjectslistActionStatus('update_projects');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawProjectslistQueryStr ={Node:btoa(decodedProjectslistToken)}
    if(customQueryStr!='')
    {
      // if no projects_dataNode set , use customQueryStr
      if (!projectslistTokenId) {
       rawProjectslistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initProjectslistProfileData(rawProjectslistQueryStr)

    if(deleteParam){
      popDeleteDialog(projectslistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setProjectslistNode(finalProfileData)
    
    
}
  
  

export function InteprateProjectslistEvent(data) {
     
  //console.log(' Projectslist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_projects){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProjectslistProfileTray')

    
    mosyUpdateUrlParam('projects_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setProjectslistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProjectslistProfileTray')

    
    mosyUpdateUrlParam('projects_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_projects){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add projects `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProjectslistProfileTray')
      }
    }
     
  }

  if(childActionName.update_projects){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update projects `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProjectslistProfileTray')
        
      }
    }
  }

  if(childActionName.delete_projects){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../projects/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteProjectslist(deleteToken).then(response=>{
  
        if(response.status!='error')
        {
          childSetters?.setSnackMessage("Record deleted succesfully!")
          childSetters?.setParentUseEffectKey(magicRandomStr());
          childSetters?.setLocalEventSignature(magicRandomStr());

          if(router){
            router.push(`${afterDeleteUrl}?snack_alert=Record Deleted successfully!`)
          }
       }
      })
  
    },
  
    onNo: () => {
  
      // Remove the param from the URL
       closeMosyModal()
       deleteUrlParam('projects_delete');
        
    }
  
  });

}