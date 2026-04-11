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
export async function insertDocumentslist() {
 //console.log(`Form documents insert sent `)

  return await mosyPostFormData({
    formId: 'documents_profile_form',
    url: apiRoutes.documentslist.base,
    method: 'POST',
    isMultipart: true,
  });
}

//update record 
export async function updateDocumentslist() {

  //console.log(`Form documents update sent `)

  return await mosyPostFormData({
    formId: 'documents_profile_form',
    url: apiRoutes.documentslist.base,
    method: 'PUT',
    isMultipart: true,
  });
}


///receive form actions from profile page  
export async function inteprateDocumentslistFormAction(e, setters) {
  e.preventDefault();

  const form = e.target;
  const formDataObj = new FormData(form);
  const actionType = formDataObj.get('documents_mosy_action');
 
 //console.log(`Form documents submission received action : ${actionType}`)

  try {
    let result = null;
    let actionMessage ='Record added succesfully!';

    if (actionType === 'add_documents') {

      actionMessage ='Record added succesfully!';

      result = await insertDocumentslist();
    }

    if (actionType === 'update_documents') {

      actionMessage ='Record updated succesfully!';

      result = await updateDocumentslist();
    }

    if (result?.status === 'success') {
      
      const documentsUptoken = btoa(result.documents_dataNode || '');

      //set id key
      setters.setDocumentslistUptoken(documentsUptoken);
      
      //update url with new documentsUptoken
      mosyUpdateUrlParam('documents_dataNode', documentsUptoken)

      setters.setDocumentslistActionStatus('update_documents')
    
      setters.setSnackMessage(actionMessage);

      return {
        status: 'success',
        message: actionMessage,
        newToken: documentsUptoken,
        actionName : actionType,
        actionType : 'documents_form_submission'
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


export async function initDocumentslistProfileData(rawQstr) { 

  MosyNotify({message : 'Refreshing Documents list' , icon:'refresh', addTimer:false})

  try {
    // Fetch the  data with the given key
    const response = await mosyGetData({
      endpoint: apiRoutes.documentslist.base,
      params: { 
      ...rawQstr,
      src : btoa(`initDocumentslistProfileData`)
      },
    });

    // Handle the successful response
    if (response.status === 'success') {
      //console.log('documents Data:', response.data);  // Process the data

       closeMosyModal()

      return response.data?.[0] || {};  // Return the actual record

    } else {
          
      console.log('Error fetching documents data:', response.message);  // Handle error
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


export async function DeleteDocumentslist(token = '') {

    try {
      MosyNotify({message:"Sending delete request",icon:"send", addTimer : false})
    
      const response = await mosyGetData({
        endpoint: apiRoutes.documentslist.delete,
        params: { 
          _documents_delete_record: (token), 
          },
      });

      console.log('Token DeleteDocumentslist '+token)
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


export async function getDocumentslistListData(qstr = {}) {

  //manage pagination 
  const pageNo = mosyUrlParam('qdocuments_page','0')
  const recordsPerPage = mosyGetLSData('systemDataLimit', '11')

  try {
    const response = await mosyGetData({
      endpoint: apiRoutes.documentslist.base,
      params: { 
        ... qstr, 
        pageNo : pageNo,
        pageSize : recordsPerPage,
        orderType : 'desc', 
        src : btoa(`getDocumentslistListData`)
        },
    });

    if (response.status === 'success') {
      //console.log('documents Data:', response.data);
      return response; //Return the data
    } else {
      console.log('Error fetching documents data:', response);
      MosyNotify({message:response.message, icon:'times-circle', iconColor :'text-danger'})
      
      return []; // Safe fallback
    }
  } catch (err) {

   MosyNotify({message:err, icon:'times-circle', iconColor :'text-danger'})

    console.log('Error:', err);
    return []; //  Even safer fallback
  }
}


export async function loadDocumentslistListData(customQueryStr, setters) {

    const gftDocumentslist = MosySecureFilterEngine('documents');
    let finalFilterStr = (gftDocumentslist);    

    if(customQueryStr!='')
    {
      finalFilterStr = customQueryStr;
    }

    setters.setDocumentslistLoading(true);
    
    const documentslistListData = await getDocumentslistListData(finalFilterStr);
    
    setters.setDocumentslistLoading(false)
    setters.setDocumentslistListData(documentslistListData?.data)

    setters.setDocumentslistListPageCount(documentslistListData?.pagination?.page_count)


    return documentslistListData

}
  
  
export async function documentslistProfileData(customQueryStr, setters, router, customProfileData={}) {

    const documentslistTokenId = mosyUrlParam('documents_dataNode');
    
    const deleteParam = mosyUrlParam('documents_delete');

    //manage  the staff_uptoken value  basically detect primkey
    let decodedDocumentslistToken = '0';
    if (documentslistTokenId) {
      
      decodedDocumentslistToken = atob(documentslistTokenId); // Decode the record_id
      setters.setDocumentslistUptoken(documentslistTokenId);
      setters.setDocumentslistActionStatus('update_documents');
      
    }
    
    //override customQueryStr if there is an active staff_uptoken else use customQueryStr if any
    let rawDocumentslistQueryStr ={Node:btoa(decodedDocumentslistToken)}
    if(customQueryStr!='')
    {
      // if no documents_dataNode set , use customQueryStr
      if (!documentslistTokenId) {
       rawDocumentslistQueryStr = customQueryStr
      }
    }

    const profileDataRecord = await initDocumentslistProfileData(rawDocumentslistQueryStr)

    if(deleteParam){
      popDeleteDialog(documentslistTokenId, setters, router)
    }
    
    // Merge with custom injected values (custom wins)
    const finalProfileData = {
      ...profileDataRecord,
      ...customProfileData,    
    };
      

    setters.setDocumentslistNode(finalProfileData)
    
    
}
  
  

export function InteprateDocumentslistEvent(data) {
     
  //console.log(' Documentslist Child gave us:', data);

  const actionName = data?.actionName

  const childActionName = { [actionName]: true };

  if(childActionName.select_documents){

    if(data?.profile)
    {
    
    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DocumentslistProfileTray')

    
    mosyUpdateUrlParam('documents_dataNode', btoa(data?.token))
    
    const router = data?.router
      
    const url = data?.url

    router.push(url, { scroll: false });

    }else{

    //const childStateSetters = data?.setters.childSetters

    const parentSetter = data?.setters.parentStateSetters 

    parentSetter?.setDocumentslistCustomProfileQuery(data?.qstr)

    parentSetter?.setLocalEventSignature(magicRandomStr())
    parentSetter?.setParentUseEffectKey(magicRandomStr())
    parentSetter?.setActiveScrollId('DocumentslistProfileTray')

    
    mosyUpdateUrlParam('documents_dataNode', btoa(data?.token))
    
    }
  }

  if(childActionName.add_documents){

    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`add documents `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DocumentslistProfileTray')
      }
    }
     
  }

  if(childActionName.update_documents){
    const stateSetter =data?.setters.childStateSetters
    const parentStateSetter =data?.setters.parentStateSetters

    //console.log(`update documents `, data?.setters)

    if(stateSetter.setLocalEventSignature){
     stateSetter?.setLocalEventSignature(magicRandomStr())
    }

    if(parentStateSetter){
      if(parentStateSetter.setLocalEventSignature){
        parentStateSetter?.setLocalEventSignature(magicRandomStr())
        parentStateSetter?.setActiveScrollId('DocumentslistProfileTray')
        
      }
    }
  }

  if(childActionName.delete_documents){

    popDeleteDialog(btoa(data?.token), data?.setters)

 }

  
}


export function popDeleteDialog(deleteToken, setters, router, afterDeleteUrl='../documents/list')
{     

  //console.log(`popDeleteDialog`, setters)
  const childSetters = setters?.childStateSetters
  
  MosyAlertCard({
  
    icon : "trash",
  
    message: "Are you sure you want to delete this record?",

    autoDismissOnClick : false,
  
    onYes: () => {
  
      DeleteDocumentslist(deleteToken).then(response=>{
  
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
       deleteUrlParam('documents_delete');
        
    }
  
  });

}