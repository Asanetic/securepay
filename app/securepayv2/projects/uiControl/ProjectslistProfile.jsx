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
import { inteprateProjectslistFormAction, projectslistProfileData , popDeleteDialog, InteprateProjectslistEvent } from '../dataControl/ProjectslistRequestHandler';

//state management
import { useProjectslistState } from '../dataControl/ProjectslistStateManager';

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

import ProjectstepslistProfile from '../../projectsteps/uiControl/ProjectstepslistProfile';
import {InteprateProjectstepslistEvent} from '../../projectsteps/dataControl/ProjectstepslistRequestHandler';
import DocumentslistProfile from '../../documents/uiControl/DocumentslistProfile';
import {InteprateDocumentslistEvent} from '../../documents/dataControl/DocumentslistRequestHandler';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from project-view.jsx
import {
  viewPage,
  viewProjectPayments
} from '../logicControl/project-view';



// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_PROJECTS";

//live data detial / profile component

export default function ProjectslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ProjectslistMainProfilePage",
    parentProfileItemId = "ProjectslistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Projectslist states
  const [stateItem, stateItemSetters] = useProjectslistState(settersOverrides);
  const projectsNode = stateItem.projectslistNode
  
  // -- basic states --//
  const paramProjectslistUptoken  = stateItem.projectslistUptoken
  const projectslistActionStatus = stateItem.projectslistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setProjectslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postProjectslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateProjectslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postProjectslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("ProjectslistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    projectslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
    mosyScrollTo(activeScrollId)
    
  }, [localEventSignature]);
  
  
  
  //child queries use effect
  
  //setProjectstepslistCustomProfileQuery Script
  const setProjectstepslistCustomProfileQuery = stateItemSetters.setProjectstepslistCustomProfileQuery;
  const projectstepslistCustomProfileQuery =  stateItem.projectstepslistCustomProfileQuery;
  
  useEffect(() => {
    if (projectsNode?.primkey && setProjectstepslistCustomProfileQuery) {
      
      const query = {projectId:btoa(projectsNode?.record_id)};
      
      const tokenUrl = mosyUrlParam("_dataNode")
      
      if(!tokenUrl)
      {
        setProjectstepslistCustomProfileQuery(query);
      }
      
    }
  }, [projectsNode, setProjectstepslistCustomProfileQuery]);
  
  //setDocumentslistCustomProfileQuery Script
  const setDocumentslistCustomProfileQuery = stateItemSetters.setDocumentslistCustomProfileQuery;
  const documentslistCustomProfileQuery =  stateItem.documentslistCustomProfileQuery;
  
  useEffect(() => {
    if (projectsNode?.primkey && setDocumentslistCustomProfileQuery) {
      
      const query =  {projectId:btoa(projectsNode?.record_id)};
      
      const tokenUrl = mosyUrlParam("_dataNode")
      
      if(!tokenUrl)
      {
        setDocumentslistCustomProfileQuery(query);
      }
      
    }
  }, [projectsNode, setDocumentslistCustomProfileQuery]);
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ProjectslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postProjectslistFormData} encType="multipart/form-data" id="projects_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {projectsNode?.primkey ? (  <span>{`Project / ${projectsNode?.project_name}`}</span> ) :(<span> New Project</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramProjectslistUptoken && (
                  <DeleteButton
                  src="ProjectslistMainProfilePage"
                  tableName="projects"
                  uptoken={paramProjectslistUptoken}
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
              
              
              
              {paramProjectslistUptoken && (
                <>
                
                <MosyActionButton
                label=" View Page"
                icon="link"
                onClick={()=>{viewPage(projectsNode)}}
                />
                
                <MosyActionButton
                label=" View payments"
                icon="credit-card"
                onClick={()=>{viewProjectPayments(projectsNode)}}
                />
                
              </>
            )}
            
            {paramProjectslistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="ProjectslistMainProfilePage"
              tableName="projects"
              uptoken={paramProjectslistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="ProjectslistMainProfilePage"
              tableName="projects"
              link="./profile"
              label="New Project"
              icon="folder-plus" />
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
                <div className="col-md-5 text-center">Project Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="projects"
                field="project_name"
                label="Project Name"
                value={projectsNode?.project_name || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Contractor</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.projectslist.base}
                  idField="primkey"
                  labelField="contractor"
                  inputName="contractor"
                  label="Contractor"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={projectsNode?.contractor || ""}
                  />
                </div>
                
                
                <MosySmartField
                module="projects"
                field="project_ref"
                label="Project Ref"
                value={projectsNode?.project_ref || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.clientledger.base}
                tblName="clients"
                parentTable="projects"
                inputName="_clients_client_name_client_id"
                hiddenInputName="client_id"
                valueField="record_id"
                displayField="client_name"
                label="Client"
                defaultValue={{ record_id: projectsNode?.client_id || "", client_name: projectsNode?._clients_client_name_client_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <MosySmartField
                module="projects"
                field="amount"
                label="Amount"
                value={projectsNode?.amount || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Currency</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.projectslist.base}
                  idField="primkey"
                  labelField="currency"
                  inputName="currency"
                  label="Currency"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={projectsNode?.currency || ""}
                  />
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Status & Progress</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Status</label>
                  
                  <select name="status" id="status" className="form-control">
                    <option  value={projectsNode?.status || ""}>{projectsNode?.status || "Select Status"}</option>
                    <option>active</option>
                    <option>completed</option>
                    <option>on-hold</option>
                    <option>cancelled</option>
                    
                  </select>
                </div>
                
                
                <MosySmartField
                module="projects"
                field="progress_percent"
                label="Progress Percent"
                value={projectsNode?.progress_percent || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="text"
                cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                />
                
                
                {projectsNode?.primkey && (
                  <div className="form-group col-md-4 hive_data_cell  ">
                    <label >Documents</label>
                    <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_documents" name="div_documents" placeholder="Documents">{projectsNode?.documents || ""}</div>
                  </div>)}
                  
                  {projectsNode?.primkey && (
                    <div className="form-group col-md-4 hive_data_cell  ">
                      <label >Steps</label>
                      <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_steps" name="div_steps" placeholder="Steps">{projectsNode?.steps || ""}</div>
                    </div>)}
                    
                    {projectsNode?.primkey && (
                      <div className="form-group col-md-4 hive_data_cell  ">
                        <label >Total Payments</label>
                        <div className="border border_set p-2 rounded_medium form-control pt-3" id="div_total_payments" name="div_total_payments" placeholder="Total Payments">{projectsNode?.total_payments || ""}</div>
                      </div>)}
                    </div>
                    
                  </div>
                  
                  <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
                    <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                      <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                      <div className="col-md-5 text-center"></div>
                      <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
                    </h5>
                    
                    <div className="col-md-12 pt-3 p-0" id=""></div>
                    
                    <div className="row justify-content-start col-md-12 p-0 m-0 ">
                      
                      <MosySmartField
                      module="projects"
                      field="created_at"
                      label="Created date"
                      value={projectsNode?.created_at || ""}
                      onChange={handleInputChange}
                      context={{ hostParent: hostParent  }}
                      inputOverrides={{}}
                      type="datetime-local"
                      cellOverrides={{additionalClass: "col-md-4 hive_data_cell "}}
                      />
                      
                    </div>
                    
                    <div className="col-md-12 text-center">
                      <SubmitButtons
                      src="ProjectslistMainProfilePage"
                      tblName="projects"
                      extraClass="optional-custom-class"
                      
                      />
                    </div>
                  </div></div>
                  {/*    Input cells section isle      */}
                </div>
                
                <section className="hive_control">
                  <input type="hidden" id="projects_dataNode" name="projects_dataNode" value={paramProjectslistUptoken}/>
                  <input type="hidden" id="projects_mosy_action" name="projects_mosy_action" value={projectslistActionStatus}/>
                </section>
                
                
              </div>
              
            </form>
            
            
            <div className="row justify-content-center m-0 pr-lg-1 pl-lg-1 pt-0 col-md-12" id="">
              {/*<hive_mini_list/>*/}
              
              {projectsNode?.primkey && (
                <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                  <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage steps`} </h5>
                  <ProjectstepslistProfile
                  key={`${ projectstepslistCustomProfileQuery}-${localEventSignature}`}
                  dataIn={{
                    
                    parentStateSetters : stateItemSetters,
                    parentUseEffectKey : localEventSignature,
                    showNavigationIsle:false,
                    customQueryStr : projectstepslistCustomProfileQuery,
                    hostParent : "ProjectslistProfile",
                    parentProfileItemId : activeScrollId,
                    customProfileData : {
                      //inject profile data
                      _projects_project_name_project_id  : projectsNode?.project_name,
                      project_id : projectsNode?.record_id,
                      client_id : projectsNode?.client_id,
                      _clients_client_name_client_id : projectsNode?._clients_client_name_client_id
                      
                    }
                    
                  }}
                  
                  dataOut={{
                    
                    setChildDataOut: InteprateProjectstepslistEvent,
                    setChildDataOutSignature: (sig) => console.log("Signature changed:", sig),
                    
                  }}
                  />
                  
                </section>
              )}
              {projectsNode?.primkey && (
                <section className="col-md-12 m-0 bg-white pt-5 p-0 ">
                  <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Manage documents`} </h5>
                  <DocumentslistProfile
                  key={`${ documentslistCustomProfileQuery}-${localEventSignature}`}
                  dataIn={{
                    
                    parentStateSetters : stateItemSetters,
                    parentUseEffectKey : localEventSignature,
                    showNavigationIsle:false,
                    customQueryStr : documentslistCustomProfileQuery,
                    hostParent : "ProjectslistProfile",
                    parentProfileItemId : activeScrollId,
                    customProfileData : {
                      //inject profile data
                      _projects_project_name_project_id  : projectsNode?.project_name,
                      project_id : projectsNode?.record_id,
                      client_id : projectsNode?.client_id,
                      _clients_client_name_client_id : projectsNode?._clients_client_name_client_id
                      
                    }
                    
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
    
