'use client';

//React
import { useEffect, useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';
//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"


//components
import { MosyAlertCard, MosyNotify ,closeMosyModal } from  '../../../MosyUtils/ActionModals';
import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//basic utils
import { mosyScrollTo , deleteUrlParam, mosyFormInputHandler,mosyUrlParam ,mosyTonum  } from '../../../MosyUtils/hiveUtils';

//data control and processors
import { inteprateClientledgerFormAction, clientledgerProfileData , popDeleteDialog, InteprateClientledgerEvent } from '../dataControl/ClientledgerRequestHandler';

//state management
import { useClientledgerState } from '../dataControl/ClientledgerStateManager';

//profile components
import {
  SubmitButtons,
  AddNewButton,
  LiveSearchDropdown,
  MosySmartField,
  MosyActionButton,
  SmartDropdown,
  DeleteButton ,
  MosyImageViewer,
  MosyFileUploadButton
} from '../../UiControl/componentControl';

//def logo
import logo from '../../../img/logo/logo.png'; // outside public!

import MosyHtmlEditor from '../../../MosyUtils/htmlEditor'

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

// Use default base root (/)
const apiRoutes = getApiRoutes();


// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_CLIENTS";

//live data detial / profile component

export default function ClientledgerProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ClientledgerMainProfilePage",
    parentProfileItemId = "ClientledgerProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Clientledger states
  const [stateItem, stateItemSetters] = useClientledgerState(settersOverrides);
  const clientsNode = stateItem.clientledgerNode
  
  // -- basic states --//
  const paramClientledgerUptoken  = stateItem.clientledgerUptoken
  const clientledgerActionStatus = stateItem.clientledgerActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setClientledgerNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postClientledgerFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateClientledgerFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postClientledgerFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("ClientledgerProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    clientledgerProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ClientledgerProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postClientledgerFormData} encType="multipart/form-data" id="clients_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {clientsNode?.primkey ? (  <span>Client ledger Profile</span>) : (<span>Add Client list</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramClientledgerUptoken && (
                  <DeleteButton
                  src="ClientledgerMainProfilePage"
                  tableName="clients"
                  uptoken={paramClientledgerUptoken}
                  stateItemSetters={stateItemSetters}
                  parentStateSetters={parentStateSetters}
                  
                  onDelete={popDeleteDialog}
                  />
                )}
              </div>)}</>
            </h3>
            {/*    Title isle      */}
            
            
            
            {/*    Navigation isle      */}
            <><div className="row justify-content-end m-0 p-0 col-md-12  p-3  hive_profile_navigation " id="">
              <div className="col-md-4 text-left p-0 hive_profile_nav_back_to_list_tray" id="">
                
                {showNavigationIsle && (
                  <>
                  <Link href={backToList} className="text-info hive_profile_nav_back_to_list "><i className="fa fa-arrow-left"></i> Back to list</Link>
                </>
              )}
              
            </div>
            <div className="col-md-8 p-0 text-right hive_profile_nav_add_new_tray" id="">
              
              
              
              {paramClientledgerUptoken && (
                <>
                
              </>
            )}
            
            {paramClientledgerUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="ClientledgerMainProfilePage"
              tableName="clients"
              uptoken={paramClientledgerUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="ClientledgerMainProfilePage"
              tableName="clients"
              link="./profile"
              label=" Add new"
              icon="plus-circle" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
            <div className="col-md-12 row justify-content-center p-0 m-0">
              <div className="col-md-12 row p-0 justify-content-start p-0 m-0">
                
                <MosySmartField
                module="clients"
                field="client_name"
                label="Client Name"
                value={clientsNode?.client_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="clients"
                field="phone_number"
                label="Phone Number"
                value={clientsNode?.phone_number || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="clients"
                field="email"
                label="Email"
                value={clientsNode?.email || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="clients"
                field="national_id"
                label="National Id"
                value={clientsNode?.national_id || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="clients"
                field="created_at"
                label="Registration date"
                value={clientsNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Industry</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.clientledger.base}
                  idField="primkey"
                  labelField="industry"
                  inputName="industry"
                  label="Industry"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={clientsNode?.industry || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Referral Source</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.clientledger.base}
                  idField="primkey"
                  labelField="referral_source"
                  inputName="referral_source"
                  label="Referral Source"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={clientsNode?.referral_source || ""}
                  />
                </div>
                
                
                <MosySmartField
                module="clients"
                field="projects"
                label="Projects"
                value={clientsNode?.projects || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="clients"
                field="total_payments"
                label="Total Payments"
                value={clientsNode?.total_payments || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="ClientledgerMainProfilePage"
                tblName="clients"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="clients_dataNode" name="clients_dataNode" value={paramClientledgerUptoken}/>
            <input type="hidden" id="clients_mosy_action" name="clients_mosy_action" value={clientledgerActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        
      </div>
    </div>
  </div>
  
  
  {/* snack notifications -- */}
  {snackMessage &&(
    <MosySnackWidget
    content={snackMessage}
    duration={5000}
    type="custom"
    onDone={() => {
      stateItemSetters.setSnackMessage("");
      stateItem.snackOnDone(); // Run whats inside onDone
      deleteUrlParam("snack_alert")
    }}
    
    />)}
    {/* snack notifications -- */}
    
    
    {/* ================== End Feature Section========================== ------*/}
  </div>
  
);

}

