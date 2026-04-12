/**
 * ════════════════════════════════════════════════════════════════
 * FILE: project-view.jsx
 * PURPOSE: Frontend logic functions for project-view
 * Function flow notes
 add your notes on how the function works here  * ════════════════════════════════════════════════════════════════
 */

import { MosyCard } from "../../../components/MosyCard";
import PaymentslistList from "../../payments/uiControl/PaymentslistList";


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewPage
/* 
Function flow notes
 
how viewPage works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewPage(projectData) {
    // Implement viewPage logic here
    //alert("viewPage");

        if (!projectData?.record_id) {
          console.error("Missing project record_id");
          return;
        }
      
        const encodedId = btoa(projectData.record_id);
        const url = `/sp?spid=${encodedId}`; // 👈 relative URL (better)
      
        window.open(url, "_blank");
      
    
}


// ════════════════════════════════════════════════════════════════
// FUNCTION: viewProjectPayments
/* 
Function flow notes
 
how viewProjectPayments works 
Steps
*/
// ════════════════════════════════════════════════════════════════
export function viewProjectPayments(projectData) {
    // Implement viewProjectPayments logic here
    //alert("viewProjectPayments");

    MosyCard("Project payments",
        <PaymentslistList
         dataIn={
            {
                customQueryStr:{projectId:btoa(projectData.record_id)},
                showDataControlSections : false

            }
        }
        />
        ,true,"modal1","mosycard_medium"
    )

}

