'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';


//print utils
import { exportTableToExcel } from '../../../MosyUtils/exportToExcel';
import { mosyPrintToPdf } from '../../../MosyUtils/hiveUtils';


//access control
import {MosyAccessControl} from "../../UiControl/MosyAccessControl"
import {MosyUIGuard } from "../../UiControl/MosyUiGuard"



//custom utils
import { deleteUrlParam, magicTrimText, mosyUrlParam, mosyFormatDateOnly , mosyFormatDateTime, mosyTonum , mosyToggleSelectAllTblRows , mosySelectTblRows } from '../../../MosyUtils/hiveUtils';
import { mosyFilterUrl } from '../../DataControl/MosyFilterEngine';

//list components
import {
  MosySmartDropdownActions,
  AddNewButton,
  MosyActionButton,
  MosyGridRowOptions,
  MosyPaginationUi,
  DeleteButton,
  MosyImageViewer
} from '../../UiControl/componentControl';

import MosySnackWidget from '../../../MosyUtils/MosySnackWidget';

//data
import { loadProjectslistListData, popDeleteDialog, InteprateProjectslistEvent  } from '../dataControl/ProjectslistRequestHandler';

//state management
import { useProjectslistState } from '../dataControl/ProjectslistStateManager';

import logo from '../../../img/logo/logo.png'; // outside public!

//large text
import ReactMarkdown from 'react-markdown';

//routes manager
///handle routes
import { getApiRoutes } from '../../AppRoutes/apiRoutesHandler';

//custom fuctions
//import {  } from '../../AppCore/coreUtils';

// Use default base root (/)
const apiRoutes = getApiRoutes();
// ════════════════════════════════════════════════════════════════
// LIST PAGE FUNCTION IMPORTS
// ════════════════════════════════════════════════════════════════
// Imports from project-view.jsx
import {
  viewProjectPayments
} from '../logicControl/project-view';



//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_PROJECTS";

//live data list component

export default function ProjectslistList({ dataIn = {}, dataOut = {} }) {
  
  //incoming data in from parent
  const {
    customQueryStr = "",
    customProfilePath="./profile",
    showDataControlSections = true,
    parentUseEffectKey = "",
    parentStateSetters=null,
  } = dataIn;
  
  //outgoing data to parent
  const {
    setChildDataOut = () => {},
    setChildDataOutSignature = () => {},
  } = dataOut;
  
  //set default state values
  const settersOverrides  = {localEventSignature : parentUseEffectKey}
  
  //manage Projectslist states
  const [stateItem, stateItemSetters] = useProjectslistState(settersOverrides);
  
  const localEventSignature = stateItem.localEventSignature
  const snackMessage = stateItem.snackMessage
  const snackOnDone = stateItem.snackOnDone
  
  //use route navigation system if need be
  const router = useRouter();
  
  useEffect(() => {
    
    const snackUrlAlert = mosyUrlParam("snack_alert")
    if(snackUrlAlert)
    {
      stateItemSetters.setSnackMessage(snackUrlAlert)
    }
    
    loadProjectslistListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute amount totals
  const sumprojects_amount = stateItem.projectslistListData?.reduce(
    (sum, row) => sum + Number(row.amount || 0),
    0
  );
  
  
  //access control managemant
  const [allowed, setAllowed] = useState(null);
  
  useEffect(() => {
    setAllowed(MosyAccessControl(MOSY_ACCESS_KEY));
  }, []);
  
  if (allowed === null) return null;
  if (!allowed) return <MosyUIGuard />;
  
  return (
    
    <div className={`col-md-12  p-0 m-0  ${showDataControlSections && ("main_list_container")}  `} style={{marginTop: "0px", paddingBottom: "0px"}}>
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"projects", keyword:stateItem.projectslistQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Projects list </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_projects" name="txt_projects" className="custom-search-input form-control" placeholder="Search in Projects list "
          onChange={(e) => stateItemSetters.setProjectslistQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qprojects_btn" name="qprojects_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="ProjectslistList" link={customProfilePath} label="New Project" icon="folder-plus" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <div className="text-left m-0 p-0 col-md-12">
          <div className="ml-2 cpointer badge btn_neo p-2 rounded badge-primary mb-3 tbl_print_btn"
          onClick={() => {mosyPrintToPdf({elemId : "projects_print_card", defaultTitle:"Projects list"})}}
          >
          <i className="fa fa-print "></i> Print List
        </div>
        <div className="cpointer p-2 ml-2 badge rounded border border_set badge-whte mb-3 tbl_print_to_excel_btn"
        
        onClick={() => exportTableToExcel("projects_data_table", "Projects list.xlsx")}
        >
        <i className="fa fa-arrow-right "></i> Export to excel
      </div>
    </div>
    <div className="col-md-12 m-0 p-0" id="projects_print_card">
      <table className="table table-hover  text-left printTarget" id="projects_data_table">
        <thead className="text-uppercase">
          <tr>
            <th scope="col">#</th>
            
            <th scope="col"><b>Client</b></th>
            <th scope="col"><b>Contractor</b></th>
            <th scope="col"><b>Project Name</b></th>
            <th scope="col"><b>Documents</b></th>
            <th scope="col"><b>Steps</b></th>
            <th scope="col"><b>Total Payments</b></th>
            <th scope="col"><b>Amount</b></th>
            <th scope="col"><b>Currency</b></th>
            <th scope="col"><b>Status</b></th>
            <th scope="col"><b>Progress Percent</b></th>
            <th scope="col"><b>Created date</b></th>
            <th scope="col"><b>Project Ref</b></th>
            
          </tr>
          
        </thead>
        <tbody>
          {stateItem.projectslistLoading ? (
            <tr>
              <th scope="col">#</th>
              <td colSpan="13" className="text-muted">
                <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Projects list ...</h5>
              </td>
            </tr>
          ) : stateItem.projectslistListData?.length > 0 ? (
            stateItem.projectslistListData.map((listprojects_result, index) => {
              
              
              
              return(
                <Fragment key={`_row_${listprojects_result.primkey}`}>
                  <tr key={listprojects_result.primkey}>
                    <td>
                      <div className="table_cell_dropdown">
                        <div className="table_cell_dropbtn">
                          
                          <b>{listprojects_result.row_count}</b></div>
                          <div className="table_cell_dropdown-content">
                            <MosySmartDropdownActions
                            tblName="projects"
                            setters={{
                              
                              childStateSetters: stateItemSetters,
                              parentStateSetters: parentStateSetters
                              
                            }}
                            
                            attributes={`${listprojects_result.primkey}:${customProfilePath}:false`}
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            
                            />
                            
                            <MosyGridRowOptions
                            src="ProjectslistList"
                            action="_view_payments"
                            label=" View payments"
                            icon="credit-card"
                            dataIn={() => viewProjectPayments(listprojects_result)}   // only runs on click now
                            callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                            />
                          </div>
                        </div>
                      </td>
                      
                      <td scope="col"><span title={listprojects_result.client_id}>{magicTrimText(listprojects_result._clients_client_name_client_id, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.contractor}>{magicTrimText(listprojects_result.contractor, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.project_name}>{magicTrimText(listprojects_result.project_name, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.documents}>{magicTrimText(listprojects_result.documents, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.steps}>{magicTrimText(listprojects_result.steps, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.total_payments}>{magicTrimText(listprojects_result.total_payments, 70)}</span></td>
                      <td scope="col"><span>{mosyTonum(listprojects_result.amount)}</span></td>
                      <td scope="col"><span title={listprojects_result.currency}>{magicTrimText(listprojects_result.currency, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.status}>{magicTrimText(listprojects_result.status, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.progress_percent}>{magicTrimText(listprojects_result.progress_percent, 70)}</span></td>
                      <td scope="col"><span title={listprojects_result.created_at}>{mosyFormatDateTime(listprojects_result.created_at)}</span></td>
                      <td scope="col"><span title={listprojects_result.project_ref}>{magicTrimText(listprojects_result.project_ref, 70)}</span></td>
                      
                    </tr>
                    
                    
                  </Fragment>)
                  
                })
                
              ) : (
                
                <tr><td colSpan="13" className="text-muted">
                  
                  
                  <div className="col-md-12 text-center mt-4">
                    <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no projects records found</h6>
                    
                    <AddNewButton src="ProjectslistList"  link={customProfilePath} label="New Project" icon="folder-plus" />
                    <div className="col-md-12 pt-5 " id=""></div>
                  </div>
                </td></tr>
                
              )}
              
              <tr className="bg-light">
                <th></th>
                
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b><span>{mosyTonum(sumprojects_amount)}</span></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                <th scope="col"><b></b></th>
                
              </tr>
            </tbody>
            
          </table>
        </div>
        <MosyPaginationUi
        src="ProjectslistList"
        tblName="projects"
        totalPages={stateItem.projectslistListPageCount}
        stateItemSetters={stateItemSetters}
        />
      </div>
      
      
    </form>
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
    </div>
  );
  
}

