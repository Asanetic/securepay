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
import { inteprateProjectstepslistFormAction, projectstepslistProfileData , popDeleteDialog, InteprateProjectstepslistEvent } from '../dataControl/ProjectstepslistRequestHandler';

//state management
import { useProjectstepslistState } from '../dataControl/ProjectstepslistStateManager';

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

import ProjectstepslistList from './ProjectstepslistList';
// ════════════════════════════════════════════════════════════════
// PROFILE PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════


// export profile


///component access control key
export const MOSY_ACCESS_KEY = "MANAGE_PROJECT_STEPS";

//live data detial / profile component

export default function ProjectstepslistProfile({ dataIn = {}, dataOut = {} }) {
  
  //initiate data exchange manifest
  //incoming data from parent
  const {
    showNavigationIsle = true,
    customQueryStr = "",
    backToList="./list",
    parentUseEffectKey = "",
    parentStateSetters=null,
    customProfileData={},
    hostParent="ProjectstepslistMainProfilePage",
    parentProfileItemId = "ProjectstepslistProfileTray"
    
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey,   activeScrollId : parentProfileItemId}
  
  //manage Projectstepslist states
  const [stateItem, stateItemSetters] = useProjectstepslistState(settersOverrides);
  const project_stepsNode = stateItem.projectstepslistNode
  
  // -- basic states --//
  const paramProjectstepslistUptoken  = stateItem.projectstepslistUptoken
  const projectstepslistActionStatus = stateItem.projectstepslistActionStatus
  const snackMessage = stateItem.snackMessage
  const activeScrollId = stateItem.activeScrollId
  
  //const snackOnDone = stateItem.snackOnDone
  
  const localEventSignature = stateItem.localEventSignature
  
  const handleInputChange = mosyFormInputHandler(stateItemSetters.setProjectstepslistNode);
  
  //use route navigation system
  const router = useRouter();
  
  //manage post form
  function postProjectstepslistFormData(e) {
    
    MosyNotify({message: "Sending request",icon:"send"})
    
    inteprateProjectstepslistFormAction(e, stateItemSetters).then(response=>{
      
      setChildDataOut({
        
        actionName : response.actionName,
        dataToken : response.newToken,
        actionsSource : "postProjectstepslistFormData",
        setters :{
          
          childStateSetters: stateItemSetters,
          parentStateSetters: parentStateSetters
          
        }
        
      })
      
      //focus on this form on submission
      stateItemSetters.setActiveScrollId("ProjectstepslistProfileTray")
      mosyScrollTo(activeScrollId)
      
      closeMosyModal()
      
    })
    
  }
  
  useEffect(() => {
    
    projectstepslistProfileData(customQueryStr, stateItemSetters, router, customProfileData)
    
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
    
    <div className="p-0 col-md-12 text-center row justify-content-center m-0  " id="ProjectstepslistProfileTray">
      {/* ================== Start Feature Section========================== ------*/}
      
      
      <div className="col-md-12 rounded text-left p-2 mb-0  bg-white ">
        <div className={` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`}>
          <form onSubmit={postProjectstepslistFormData} encType="multipart/form-data" id="project_steps_profile_form">
            
            {/*    Title isle      */}
            <div className="col-md-12 pt-4 p-0 hive_profile_title_top d-lg-none" id=""></div>
            <h3 className="col-md-12 title_text text-left p-0 pt-3 hive_profile_title row justify-content-center m-0 ">
              <div className="col m-0 p-0 pb-3">
                {project_stepsNode?.primkey ? (  <span>{`Step / ${project_stepsNode?.step_name}`}</span> ) :(<span> New Step</span>)}
              </div>
              <>{!showNavigationIsle && (<div className="col m-0 p-0 text-right ">
                {paramProjectstepslistUptoken && (
                  <DeleteButton
                  src="ProjectstepslistMainProfilePage"
                  tableName="project_steps"
                  uptoken={paramProjectstepslistUptoken}
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
              
              
              
              {paramProjectstepslistUptoken && (
                <>
                
              </>
            )}
            
            {paramProjectstepslistUptoken && showNavigationIsle && (
              <>
              
              <DeleteButton
              src="ProjectstepslistMainProfilePage"
              tableName="project_steps"
              uptoken={paramProjectstepslistUptoken}
              stateItemSetters={stateItemSetters}
              parentStateSetters={parentStateSetters}
              router={router}
              onDelete={popDeleteDialog}
              />
              
              
              <AddNewButton
              src="ProjectstepslistMainProfilePage"
              tableName="project_steps"
              link="./profile"
              label="New Step"
              icon="list-check" />
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
                <div className="col-md-5 text-center">Step Details</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                <LiveSearchDropdown
                apiEndpoint={apiRoutes.projectslist.base}
                tblName="projects"
                parentTable="project_steps"
                inputName="_projects_project_name_project_id"
                hiddenInputName="project_id"
                valueField="record_id"
                displayField="project_name"
                label="Project"
                defaultValue={{ record_id: project_stepsNode?.project_id || "", project_name: project_stepsNode?._projects_project_name_project_id || "" }}
                onSelect={(id) => console.log("Just the ID:", id)}
                onSelectFull={(dataRes) =>  console.log("Data seleted")}
                onInputChange={handleInputChange}
                defaultColSize="col-md-4 hive_data_cell "
                context={{hostParent : hostParent}}
                />
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Step Name</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.projectstepslist.base}
                  idField="primkey"
                  labelField="step_name"
                  inputName="step_name"
                  label="Step Name"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={project_stepsNode?.step_name || ""}
                  />
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label >Step Status</label>
                  
                  <select name="step_status" id="step_status" className="form-control">
                    <option  value={project_stepsNode?.step_status || ""}>{project_stepsNode?.step_status || "Select Step Status"}</option>
                    <option>pending</option>
                    <option>in-progress</option>
                    <option>completed</option>
                    <option>blocked</option>
                    
                  </select>
                </div>
                
                
                <div className="form-group col-md-4 hive_data_cell ">
                  <label className="d-none">Step Order</label>
                  
                  <SmartDropdown
                  apiEndpoint={apiRoutes.projectstepslist.base}
                  idField="primkey"
                  labelField="step_order"
                  inputName="step_order"
                  label="Step Order"
                  onSelect={(val) => console.log('Selected:', val)}
                  defaultValue={project_stepsNode?.step_order || ""}
                  />
                </div>
                
              </div>
              
            </div>
            
            <div className="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section  ">
              <h5 className="col-md-12 row p-2 justify-content-center p-0 m-0">
                <div className="col-md-3 bg-dark mb-3 mb-lg-0 mt-lg-3" style={{height: "1px"}}></div>
                <div className="col-md-5 text-center">Notes</div>
                <div className="col-md-4 bg-dark mt-3" style={{height: "1px"}}></div>
              </h5>
              
              <div className="col-md-12 pt-3 p-0" id=""></div>
              
              <div className="row justify-content-start col-md-12 p-0 m-0 ">
                
                <MosySmartField
                module="project_steps"
                field="notes"
                label="Notes"
                value={project_stepsNode?.notes || ""}
                onChange={handleInputChange}
                context={{ hostParent: hostParent  }}
                inputOverrides={{}}
                type="textarea"
                cellOverrides={{additionalClass: "col-md-12 hive_data_cell"}}
                />
                
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
                
                <input className="form-control" id="created_at" name="created_at" value={project_stepsNode?.created_at || ""} placeholder="Created date" type="hidden"/>
                
              </div>
              
              <div className="col-md-12 text-center">
                <SubmitButtons
                src="ProjectstepslistMainProfilePage"
                tblName="project_steps"
                extraClass="optional-custom-class"
                
                />
              </div>
            </div></div>
            {/*    Input cells section isle      */}
          </div>
          
          <section className="hive_control">
            <input type="hidden" id="project_steps_dataNode" name="project_steps_dataNode" value={paramProjectstepslistUptoken}/>
            <input type="hidden" id="project_steps_mosy_action" name="project_steps_mosy_action" value={projectstepslistActionStatus}/>
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
      {project_stepsNode?.primkey && (
        <section className="col-md-12 m-0  pt-5 p-0 ">
          <h5 className="col-md-12 text-left  border-bottom pl-lg-1 text-muted mb-3"> {`Project Steps`} </h5>
          
          <div className="col-md-12 p-2 text-right ">
            <a href={`./list?project_steps_mosyfilter=${btoa(` {projectId:btoa(project_stepsNode?.project_id)} `)}`} className="cpointer"> View More  <i className="fa fa-arrow-right "></i></a>
          </div>
          
          <ProjectstepslistList
          key={`${customQueryStr}-${localEventSignature}`}
          dataIn={{
            parentStateSetters : stateItemSetters,
            parentUseEffectKey : localEventSignature,
            showNavigationIsle:false,
            showDataControlSections:false,
            customQueryStr :  {projectId:btoa(project_stepsNode?.project_id)} ,
            customProfilePath:""
            
          }}
          
          dataOut={{
            setChildDataOut: InteprateProjectstepslistEvent,
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

