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
import { intepratePaymentslistFormAction, paymentslistProfileData , popDeleteDialog, IntepratePaymentslistEvent } from '../dataControl/PaymentslistRequestHandler';

//state management
import { usePaymentslistState } from '../dataControl/PaymentslistStateManager';

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
export const MOSY_ACCESS_KEY = "MANAGE_PAYMENTS";

//live data detial / profile component

export default function PaymentslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="PaymentslistMainProfilePage",
    parentProfileItemId = "PaymentslistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Paymentslist states
  const [stateItem, stateItemSetters] = usePaymentslistState(settersOverrides);
  const paymentsNode = stateItem.paymentslistNode
  
  // -- basic states --//
  const paramPaymentslistUptoken  = stateItem.paymentslistUptoken
  const paymentslistActionStatus = stateItem.paymentslistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setPaymentslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postPaymentslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    intepratePaymentslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postPaymentslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("PaymentslistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    paymentslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="PaymentslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postPaymentslistFormData} encType="multipart/form-data" id="payments_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {paymentsNode?.primkey ? (  <span>{`Payment / ${paymentsNode?.record_id}`}</span> ) :(<span> New Payment</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramPaymentslistUptoken && (
                  <DeleteButton
                  src="PaymentslistMainProfilePage"
                  tableName="payments"
                  uptoken={paramPaymentslistUptoken}
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
              
              
              
              {paramPaymentslistUptoken && (
                <>
                
              </>
            )}
            
            {paramPaymentslistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="PaymentslistMainProfilePage"
              tableName="payments"
              uptoken={paramPaymentslistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="PaymentslistMainProfilePage"
              tableName="payments"
              link="./profile"
              label="New Payment"
              icon="credit-card" />
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
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Payment Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="payments"
                field="payer_name"
                label="Payer Name"
                value={paymentsNode?.payer_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="payments"
                field="payer_phone"
                label="Payer Phone"
                value={paymentsNode?.payer_phone || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="payments"
                field="amount"
                label="Amount"
                value={paymentsNode?.amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Payment Method</label>
                  
                  <select name="payment_method" id="payment_method" className="form-control">
                    <option  value={paymentsNode?.payment_method || ""}>{paymentsNode?.payment_method || "Select Payment Method"}</option>
                    <option>cash</option>
                    <option>mpesa</option>
                    <option>bank</option>
                    <option>card</option>
                    
                  </select>
                </div>
                
                
                <MosySmartField
                module="payments"
                field="transaction_code"
                label="Transaction Code"
                value={paymentsNode?.transaction_code || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">References</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.projectslist.base}
                tblName="projects"
                parentTable="payments"
                inputName="_projects_project_name_project_id"
                hiddenInputName="project_id"
                valueField="record_id"
                displayField="project_name"
                label="Project"
                defaultValue={{ record_id: paymentsNode?.project_id || "", project_name: paymentsNode?._projects_project_name_project_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.clientledger.base}
                tblName="clients"
                parentTable="payments"
                inputName="_clients_client_name_client_id"
                hiddenInputName="client_id"
                valueField="record_id"
                displayField="client_name"
                label="Client"
                defaultValue={{ record_id: paymentsNode?.client_id || "", client_name: paymentsNode?._clients_client_name_client_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="payments"
                field="bill_ref_no"
                label="Bill Ref No"
                value={paymentsNode?.bill_ref_no || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Status & Dates</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={paymentsNode?.status || ""}>{paymentsNode?.status || "Select Status"}</option>
                    <option>pending</option>
                    <option>paid</option>
                    <option>failed</option>
                    <option>refunded</option>
                    
                  </select>
                </div>
                
                
                <MosySmartField
                module="payments"
                field="paid_at"
                label="Payment date"
                value={paymentsNode?.paid_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="date"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <MosySmartField
                module="payments"
                field="created_at"
                label="Created At"
                value={paymentsNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="PaymentslistMainProfilePage"
                tblName="payments"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="payments_dataNode" name="payments_dataNode" value={paramPaymentslistUptoken}/>
            <input type="hidden" id="payments_mosy_action" name="payments_mosy_action" value={paymentslistActionStatus}/>
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

