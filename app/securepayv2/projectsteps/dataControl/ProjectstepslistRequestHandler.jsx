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
export async function insertProjectstepslist() {
 //console.log(`Form project_steps insert sent `)

  return await mosyPostFormData({
    formId: 'project_steps_profile_form',
    url: apiRoutes.projectstepslist.base,
    method: 'POST',
    isMultipart: false,
  });
}

//update record 
export async function updateProjectstepslist() {

  //console.log(`Form project_steps update sent `)

  return await mosyPostFormData({
    formId: 'project_steps_profile_form',
    url: apiRoutes.projectstepslist.base,
    method: 'PUT',
    isMultipart: false,
  });
}


///receive form actions from profile page  
export async function inteprateProjectstepslistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('project_steps_mosy_action');
 
 //console.log(`Form project_steps submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_project_steps') {

      actionMessage ='Record added succesfully!';

      result = await insertProjectstepslist();
    }

    if (actionType === 'update_project_steps') {

      actionMessage ='Record updated succesfully!';

      result = await updateProjectstepslist();
    }

    if (result?.status === 'success') {
      
      const project_stepsUptoken = btoa(result.project_steps_dataNode || '');

      //set id key
      setters.setProjectstepslistUptoken(project_stepsUptoken);
      
      //update url with new project_stepsUptoken
      mosyUpdateUrlParam('project_steps_dataNode', project_stepsUptoken)

      setters.setProjectstepslistActionStatus('update_project_steps')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: project_stepsUptoken,
        actionName : actionType,
        actionType : 'project_steps_form_submission'
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


export async function initProjectstepslistProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Project steps list' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.projectstepslist.base,
      params: { 
      ...rawQstr,
      src : btoa(`initProjectstepslistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('projectsteps Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching projectsteps data:', response.message);  // Handle error
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


export async function DeleteProjectstepslist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.projectstepslist.delete,
        params: { 
          _project_steps_delete_record: (token), 
          },
      });

      console.log('Token DeleteProjectstepslist '+token)
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


export async function getProjectstepslistListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qproject_steps_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.projectstepslist.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getProjectstepslistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('projectsteps Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching projectsteps data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadProjectstepslistListData(customQueryStr, setters) {

    const gftProjectstepslist = MosySecureFilterEngine('project_steps');
    let finalFilterStr = (gftProjectstepslist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setProjectstepslistLoading(true);
    
    const projectstepslistListData = await getProjectstepslistListData(finalFilterStr);
    
    setters.setProjectstepslistLoading(false)
    setters.setProjectstepslistListData(projectstepslistListData?.data)

    setters.setProjectstepslistListPageCount(projectstepslistListData?.pagination?.page_count)


    return projectstepslistListData

}
  
  
export async function projectstepslistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const projectstepslistTokenId = mosyUrlParam('project_steps_dataNode');
    
    const deleteParam = mosyUrlParam('project_steps_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedProjectstepslistToken = '0';
    if (projectstepslistTokenId) {
      
      decodedProjectstepslistToken = atob(projectstepslistTokenId); // Decode the record_id
      setters.setProjectstepslistUptoken(projectstepslistTokenId);
      setters.setProjectstepslistActionStatus('update_project_steps');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawProjectstepslistQueryStr ={Node:btoa(decodedProjectstepslistToken)}
    if(customQueryStr!='')
    {
      // if no project_steps_dataNode set , use customQueryStr
      if (!projectstepslistTokenId) {
       rawProjectstepslistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initProjectstepslistProfileData(rawProjectstepslistQueryStr)

    if(deleteParam){
      popDeleteDialog(projectstepslistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setProjectstepslistNode(finalProfileData)
    
    
}
  
  

export function InteprateProjectstepslistEvent(data) {
     
  //console.log(' Projectstepslist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_project_steps){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProjectstepslistProfileTray')

    
    mosyUpdateUrlParam('project_steps_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setProjectstepslistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ProjectstepslistProfileTray')

    
    mosyUpdateUrlParam('project_steps_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_project_steps){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add project_steps `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProjectstepslistProfileTray')
      }
    }
     
  }

  if(childActionName.update_project_steps){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update project_steps `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ProjectstepslistProfileTray')
        
      }
    }
  }

  if(childActionName.delete_project_steps){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../projectsteps/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteProjectstepslist(deleteToken).then(response=>{
  
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
       deleteUrlParam('project_steps_delete');
        
    }
  
  });

}