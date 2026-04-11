'use client';
//React
import { useEffect, useState ,Fragment } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';



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
import { loadClientledgerListData, popDeleteDialog, InteprateClientledgerEvent  } from '../dataControl/ClientledgerRequestHandler';

//state management
import { useClientledgerState } from '../dataControl/ClientledgerStateManager';

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


//export list



///component access control key
export const MOSY_ACCESS_KEY = "VIEW_CLIENTS";

//live data list component

export default function ClientledgerList({ dataIn = {}, dataOut = {} }) {
  
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
  
  //manage Clientledger states
  const [stateItem, stateItemSetters] = useClientledgerState(settersOverrides);
  
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
    
    loadClientledgerListData(customQueryStr, stateItemSetters);
    
  }, [localEventSignature]);
  
  
  // Compute projects totals
  const sumclients_projects = stateItem.clientledgerListData?.reduce(
    (sum, row) => sum + Number(row.projects || 0),
    0
  );
  
  // Compute total_payments totals
  const sumclients_total_payments = stateItem.clientledgerListData?.reduce(
    (sum, row) => sum + Number(row.total_payments || 0),
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
      <form method="post" onSubmit={()=>{mosyFilterUrl({tableName:"clients", keyword:stateItem.clientledgerQuerySearchStr})}} encType="multipart/form-data">
      
      {showDataControlSections && (<div className="row justify-content-end col-md-12 text-right pt-3 pb-3 data_list_section ml-0 mr-0 mb-3 border-bottom pr-0 pl-0" id="">
        <div className="col-md-6 p-0 text-left pt-3 hive_list_title">
          <h6 className="text-muted"><b> Client ledger </b></h6>
        </div>
        <div className="col-md-6 p-0 text-right hive_list_search_tray">
          <input type="text" id="txt_clients" name="txt_clients" className="custom-search-input form-control" placeholder="Search in Client ledger "
          onChange={(e) => stateItemSetters.setClientledgerQuerySearchStr(e.target.value)}
          />
          <button className="custom-search-botton" id="qclients_btn" name="qclients_btn" type="submit"><i className="fa fa-search mr-1"></i> Go </button>
        </div>
        <div className="col-md-12 pt-5 p-0 hive_list_search_divider" id=""></div>
        <div className="row justify-content-end m-0 p-0 col-md-12 hive_list_action_btn_tray" id="">
          <div className="col-md-5 d-none p-0 text-left hive_list_nav_left_ribbon" id="">
          </div>
          <div className="col-md-12 p-0 hive_list_nav_right_ribbon" id="">
            {/*--<navgation_buttons/>--*/}
            
            <a href="list" className="medium_btn border border_set btn-white hive_list_nav_refresh ml-3"><i className="fa fa-refresh mr-1 "></i> Refresh </a>
            
            
            <AddNewButton src="ClientledgerList" link={customProfilePath} label=" Add new" icon="plus-circle" />
          </div>
        </div>
      </div> )}
      
      
      <div className="table-responsive  data-tables bottom_tbl_handler">
        
        
        <table className="table table-hover  text-left printTarget" id="clients_data_table">
          <thead className="text-uppercase">
            <tr>
              <th scope="col">#</th>
              
              <th scope="col"><b>Client Name</b></th>
              <th scope="col"><b>Phone Number</b></th>
              <th scope="col"><b>Email</b></th>
              <th scope="col"><b>Registration date</b></th>
              <th scope="col"><b>Industry</b></th>
              <th scope="col"><b>Referral Source</b></th>
              <th scope="col"><b>Projects</b></th>
              <th scope="col"><b>Total Payments</b></th>
              
            </tr>
            
          </thead>
          <tbody>
            {stateItem.clientledgerLoading ? (
              <tr>
                <th scope="col">#</th>
                <td colSpan="9" className="text-muted">
                  <h5 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-spinner fa-spin"></i> Loading Client ledger ...</h5>
                </td>
              </tr>
            ) : stateItem.clientledgerListData?.length > 0 ? (
              stateItem.clientledgerListData.map((listclients_result, index) => {
                
                
                
                return(
                  <Fragment key={`_row_${listclients_result.primkey}`}>
                    <tr key={listclients_result.primkey}>
                      <td>
                        <div className="table_cell_dropdown">
                          <div className="table_cell_dropbtn">
                            
                            <b>{listclients_result.row_count}</b></div>
                            <div className="table_cell_dropdown-content">
                              <MosySmartDropdownActions
                              tblName="clients"
                              setters={{
                                
                                childStateSetters: stateItemSetters,
                                parentStateSetters: parentStateSetters
                                
                              }}
                              
                              attributes={`${listclients_result.primkey}:${customProfilePath}:false`}
                              callBack={(incomingRequest) => {setChildDataOut(incomingRequest) }}
                              
                              />
                              
                            </div>
                          </div>
                        </td>
                        
                        <td scope="col"><span title={listclients_result.client_name}>{magicTrimText(listclients_result.client_name, 70)}</span></td>
                        <td scope="col"><span title={listclients_result.phone_number}>{magicTrimText(listclients_result.phone_number, 70)}</span></td>
                        <td scope="col"><span title={listclients_result.email}>{magicTrimText(listclients_result.email, 70)}</span></td>
                        <td scope="col"><span title={listclients_result.created_at}>{mosyFormatDateTime(listclients_result.created_at)}</span></td>
                        <td scope="col"><span title={listclients_result.industry}>{magicTrimText(listclients_result.industry, 70)}</span></td>
                        <td scope="col"><span title={listclients_result.referral_source}>{magicTrimText(listclients_result.referral_source, 70)}</span></td>
                        <td scope="col"><span>{mosyTonum(listclients_result.projects)}</span></td>
                        <td scope="col"><span>{mosyTonum(listclients_result.total_payments)}</span></td>
                        
                      </tr>
                      
                      
                    </Fragment>)
                    
                  })
                  
                ) : (
                  
                  <tr><td colSpan="9" className="text-muted">
                    
                    
                    <div className="col-md-12 text-center mt-4">
                      <h6 className="col-md-12 text-center p-3 mb-5 text-muted"><i className="fa fa-search"></i> Sorry, no client list records found</h6>
                      
                      <AddNewButton src="ClientledgerList"  link={customProfilePath} label=" Add new" icon="plus-circle" />
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
                  <th scope="col"><b><span>{mosyTonum(sumclients_projects)}</span></b></th>
                  <th scope="col"><b><span>{mosyTonum(sumclients_total_payments)}</span></b></th>
                  
                </tr>
              </tbody>
              
            </table>
            
            <MosyPaginationUi
            src="ClientledgerList"
            tblName="clients"
            totalPages={stateItem.clientledgerListPageCount}
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
    
