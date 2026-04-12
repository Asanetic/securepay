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
import { inteprateDocumentslistFormAction, documentslistProfileData , popDeleteDialog, InteprateDocumentslistEvent } from '../dataControl/DocumentslistRequestHandler';

//state management
import { useDocumentslistState } from '../dataControl/DocumentslistStateManager';

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

import DocumentslistList from './DocumentslistList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_DOCUMENTS";

//live data detial / profile component

export default function DocumentslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="DocumentslistMainProfilePage",
    parentProfileItemId = "DocumentslistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Documentslist states
  const [stateItem, stateItemSetters] = useDocumentslistState(settersOverrides);
  const documentsNode = stateItem.documentslistNode
  
  // -- basic states --//
  const paramDocumentslistUptoken  = stateItem.documentslistUptoken
  const documentslistActionStatus = stateItem.documentslistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setDocumentslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postDocumentslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateDocumentslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postDocumentslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("DocumentslistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    documentslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="DocumentslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postDocumentslistFormData} encType="multipart/form-data" id="documents_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {documentsNode?.primkey ? (  <span>{`Document / ${documentsNode?.doc_type}`}</span> ) :(<span> New Document</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramDocumentslistUptoken && (
                  <DeleteButton
                  src="DocumentslistMainProfilePage"
                  tableName="documents"
                  uptoken={paramDocumentslistUptoken}
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
              
              
              
              {paramDocumentslistUptoken && (
                <>
                
              </>
            )}
            
            {paramDocumentslistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="DocumentslistMainProfilePage"
              tableName="documents"
              uptoken={paramDocumentslistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="DocumentslistMainProfilePage"
              tableName="documents"
              link="./profile"
              label="New Document"
              icon="file-plus" />
            </>
          )}
          
        </div>
      </div></>
      <div className="col-md-12 pt-4 p-0 hive_profile_navigation_divider d-lg-none" id=""></div>
      {/*    Navigation isle      */}
      <div className="row justify-content-center m-0 p-0 col-md-12" id="">
        {/*    Image section isle      */}
        
        <div className="col-md-6 mr-lg-5">
          
          <div className="col-md-12 p-0 text-center mb-3">
            <div className="col-md-12 m-2"><b>File Url</b></div>
            <MosyImageViewer
            media={`/api/mediaroom?media=${btoa((documentsNode?.file_url || ""))}`}
            mediaRoot={""}
            defaultLogo={logo.src}
            imageClass="product_image"
            />
            
            <div className="">
              <MosyFileUploadButton
              tblName="documents"
              attribute="file_url"
              />
            </div>
            <input type="hidden" name="media_documents_file_url" value={documentsNode?.file_url || ""}/>
          </div>
          
          
        </div>
        {/*    Image section isle      */}
        
        {/*  //-------------    main content starts here  ------------------------------ */}
        
        
        
        <div className="col-md-12 row justify-content-center m-0  p-0">
          {/*    Input cells section isle      */}
          <div className="col-md-12 row p-0 justify-content-center p-0 m-0">
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Document Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-8">
                  <label className="d-none">File name</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.documentslist.base}
                  idField="primkey"
                  labelField="document_name"
                  inputName="document_name"
                  label="File name"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={documentsNode?.document_name || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-4">
                  <label className="d-none">File category</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.documentslist.base}
                  idField="primkey"
                  labelField="doc_type"
                  inputName="doc_type"
                  label="File category"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={documentsNode?.doc_type || ""}
                  />
                </div>
                
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
                parentTable="documents"
                inputName="_projects_project_name_project_id"
                hiddenInputName="project_id"
                valueField="record_id"
                displayField="project_name"
                label="Project"
                defaultValue={{ record_id: documentsNode?.project_id || "", project_name: documentsNode?._projects_project_name_project_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-6 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.clientledger.base}
                tblName="clients"
                parentTable="documents"
                inputName="_clients_client_name_client_id"
                hiddenInputName="client_id"
                valueField="record_id"
                displayField="client_name"
                label="Client"
                defaultValue={{ record_id: documentsNode?.client_id || "", client_name: documentsNode?._clients_client_name_client_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-6 hive_data_cell "
                context={{hostParent : hostParent}}
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
                
                <div className="form-group col-md-6 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={documentsNode?.status || ""}>{documentsNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>archived</option>
                    <option>pending</option>
                    
                  </select>
                </div>
                
                
                <MosySmartField
                module="documents"
                field="created_at"
                label="Uploaded date"
                value={documentsNode?.created_at || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="datetime-local"
                cellOverrides={{additionalClass: "col-md-6 hive_data_cell "}}
                />
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="DocumentslistMainProfilePage"
                tblName="documents"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="documents_dataNode" name="documents_dataNode" value={paramDocumentslistUptoken}/>
            <input type="hidden" id="documents_mosy_action" name="documents_mosy_action" value={documentslistActionStatus}/>
          </section>
          
          
        </div>
        
      </form>
      
      
      <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
        {/*<hive_mini_list/>*/}
        
        
        
        <style jsx global>{`
        .data_list_section {
          display: none;
        }
        .bottom_tbl_handler{
          padding-bottom:70px!important;
        }
        `}
      </style>
      {documentsNode?.primkey && (
        <section className="col-md-12 m-0  pt-5 p-0 ">
          <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Project Documents`} </h5>
          
          <div className="col-md-12 p-2 text-right ">
            <a href={`./list?documents_mosyfilter=${btoa(` {projectId:btoa(documentsNode?.project_id)}  `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
          </div>
          
          <DocumentslistList
          key={`${customQueryStr}-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr :  {projectId:btoa(documentsNode?.project_id)}  ,
            customProfilePath:""
            
          }}
          
          dataOut={{
            setChildDataOut: InteprateDocumentslistEvent,
            setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
          }}
          />
        </section>
      )}
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

