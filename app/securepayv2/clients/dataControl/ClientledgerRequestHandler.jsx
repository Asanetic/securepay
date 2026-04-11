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
export async function insertClientledger() {
 //console.log(`Form clients insert sent `)

  return await mosyPostFormData({
    formId: 'clients_profile_form',
    url: apiRoutes.clientledger.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateClientledger() {

  //console.log(`Form clients update sent `)

  return await mosyPostFormData({
    formId: 'clients_profile_form',
    url: apiRoutes.clientledger.base,
    method: 'PUT',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateClientledgerFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('clients_mosy_action');
 
 //console.log(`Form clients submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_clients') {

      actionMessage ='Record added succesfully!';

      result = await insertClientledger();
    }

    if (actionType === 'update_clients') {

      actionMessage ='Record updated succesfully!';

      result = await updateClientledger();
    }

    if (result?.status === 'success') {
      
      const clientsUptoken = btoa(result.clients_dataNode || '');

      //set id key
      setters.setClientledgerUptoken(clientsUptoken);
      
      //update url with new clientsUptoken
      mosyUpdateUrlParam('clients_dataNode', clientsUptoken)

      setters.setClientledgerActionStatus('update_clients')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: clientsUptoken,
        actionName : actionType,
        actionType : 'clients_form_submission'
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


export async function initClientledgerProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Client ledger' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.clientledger.base,
      params: { 
      ...rawQstr,
      src : btoa(`initClientledgerProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('clients Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching clients data:', response.message);  // Handle error
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


export async function DeleteClientledger(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.clientledger.delete,
        params: { 
          _clients_delete_record: (token), 
          },
      });

      console.log('Token DeleteClientledger '+token)
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


export async function getClientledgerListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qclients_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.clientledger.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getClientledgerListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('clients Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching clients data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadClientledgerListData(customQueryStr, setters) {

    const gftClientledger = MosySecureFilterEngine('clients');
    let finalFilterStr = (gftClientledger);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setClientledgerLoading(true);
    
    const clientledgerListData = await getClientledgerListData(finalFilterStr);
    
    setters.setClientledgerLoading(false)
    setters.setClientledgerListData(clientledgerListData?.data)

    setters.setClientledgerListPageCount(clientledgerListData?.pagination?.page_count)


    return clientledgerListData

}
  
  
export async function clientledgerProfileData(customQueryStr, setters, router, customProfileData={}) {

    const clientledgerTokenId = mosyUrlParam('clients_dataNode');
    
    const deleteParam = mosyUrlParam('clients_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedClientledgerToken = '0';
    if (clientledgerTokenId) {
      
      decodedClientledgerToken = atob(clientledgerTokenId); // Decode the record_id
      setters.setClientledgerUptoken(clientledgerTokenId);
      setters.setClientledgerActionStatus('update_clients');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawClientledgerQueryStr ={Node:btoa(decodedClientledgerToken)}
    if(customQueryStr!='')
    {
      // if no clients_dataNode set , use customQueryStr
      if (!clientledgerTokenId) {
       rawClientledgerQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initClientledgerProfileData(rawClientledgerQueryStr)

    if(deleteParam){
      popDeleteDialog(clientledgerTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setClientledgerNode(finalProfileData)
    
    
}
  
  

export function InteprateClientledgerEvent(data) {
     
  //console.log(' Clientledger Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_clients){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ClientledgerProfileTray')

    
    mosyUpdateUrlParam('clients_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setClientledgerCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('ClientledgerProfileTray')

    
    mosyUpdateUrlParam('clients_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_clients){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add clients `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ClientledgerProfileTray')
      }
    }
     
  }

  if(childActionName.update_clients){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update clients `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('ClientledgerProfileTray')
        
      }
    }
  }

  if(childActionName.delete_clients){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../clients/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteClientledger(deleteToken).then(response=>{
  
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
       deleteUrlParam('clients_delete');
        
    }
  
  });

}