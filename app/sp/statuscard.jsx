import { useMemo, useState } from "react";
import { mosyBtoa, mosyPostData, toNum } from "../MosyUtils/hiveUtils";
import { getStepState } from "./paymentcard";
import { MosyAlertCard, MosyNotify } from "../MosyUtils/ActionModals";
import { getApiRoutes } from "../securepayv2/AppRoutes/apiRoutesHandler";
import { closeMosyCard, MosyCard } from "../components/MosyCard";

const apiRoutes = getApiRoutes();

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function sortSteps(steps = []) {
  return [...steps].sort((a, b) => Number(a.step_order || 0) - Number(b.step_order || 0));
}

function toSafeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatProjectStatus(status, hasPayments) {
  const s = normalizeStatus(status);

  if (!hasPayments) {
    return {
      label: "Awaiting Payment",
      className: "elforge_mosy_status_pending",
      icon: "fa fa-clock",
    };
  }

  if (s === "completed" || s === "done") {
    return {
      label: "Completed",
      className: "elforge_mosy_status_active",
      icon: "fa fa-circle-check",
    };
  }

  if (s === "active" || s === "in progress") {
    return {
      label: "In Progress",
      className: "elforge_mosy_status_active",
      icon: "fa fa-circle-check",
    };
  }

  return {
    label: status || "Pending",
    className: "elforge_mosy_status_pending",
    icon: "fa fa-clock",
  };
}

function makeMediaUrl(fileUrl) {
  if (!fileUrl) return "#";
  return `/api/mediaroom?media=${encodeURIComponent(mosyBtoa(fileUrl))}`;
}

export default function StatusCard({ data }) {
  const project = data?.project || {};
  const documents = data?.documents || [];
  const steps = sortSteps(data?.project_steps || []);
  const payments = data?.payments || [];
  const [currentStatus, setCurrentStatus] = useState(project?.status || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeStepIndex = steps.findIndex((s) => normalizeStatus(s?.step_status) !== "completed");
  const computedActiveStepIndex = activeStepIndex === -1 ? steps.length - 1 : activeStepIndex;


  const hasPayments = payments.length > 0;
  const totalPaid = payments.reduce((sum, p) => sum + toSafeNumber(p?.amount), 0);
  const statusMeta = formatProjectStatus(currentStatus, hasPayments);
  const progressPercent = Number(project?.progress_percent || 0);
  const nextStep = steps.find((s) => normalizeStatus(s?.step_status) !== "completed") || null;
  const normalizedCurrentStatus = normalizeStatus(currentStatus);
  const showNoButtons = normalizedCurrentStatus === "completed" || normalizedCurrentStatus === "complete";
  const showApproveOnly = normalizedCurrentStatus === "under review";
  const canApprove = !showNoButtons;
  const canReview = !showNoButtons && !showApproveOnly;

  const currentStepText = nextStep?.step_name || (steps.length ? steps[steps.length - 1]?.step_name : "Not started");
  const resolvedProjectId = project?.record_id || project?.primkey || "";

  const actionMessageMap = useMemo(
    () => ({
      completed: "Project marked as complete successfully.",
      "under review": "Project sent to under review successfully.",
    }),
    []
  );

  async function submitProjectStatus(nextStatus) {
    if (!resolvedProjectId) {
      MosyAlertCard({
        icon: "exclamation-triangle",
        iconColor: "text-danger",
        message: "Missing project id.",
        yesLabel: "Ok",
        noLabel: "none",
      });
      return;
    }

    setIsSubmitting(true);
    MosyNotify({message:`Sending request...`, icon:`send`,addTimer:false, id:"modal3"});
    try {
      const res = await mosyPostData({
        url: apiRoutes.smartapi.base,
        data: {
          action: "updateProjectstatus",
          payload: {
            project_id: resolvedProjectId,
            status: nextStatus,
          },
        },
      });

      const isOk = res?.data?.success === true;
      const updatedStatus = res?.data?.data?.project?.status || nextStatus;

      closeMosyCard("modal3")
      
      if (!isOk) {
        MosyAlertCard({
          icon: "times-circle",
          iconColor: "text-danger",
          message: res?.data?.message || "Failed to update project status.",
          yesLabel: "Ok",
          noLabel: "none",
        });
        return;
      }

      setCurrentStatus(updatedStatus);

      MosyAlertCard({
        icon: "check-circle",
        iconColor: "text-success",
        message: actionMessageMap[normalizeStatus(nextStatus)] || "Project status updated successfully.",
        yesLabel: "Ok",
        noLabel: "none",
      });
    } catch (error) {
      MosyAlertCard({
        icon: "times-circle",
        iconColor: "text-danger",
        message: error?.message || "Failed to update project status.",
        yesLabel: "Ok",
        noLabel: "none",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function confirmProjectStatus(nextStatus) {

    const modalMessage = (
      <div className="container-fluid p-0 text-left" style={{ lineHeight: "35px" }}>
    
        {/* Header */}
        <div className="row m-0 col-md-12 px-0 justify-content-start text-left mb-2">
          <div className="col-md-12 mx-0 align-items-center justify-content-start text-left">
            <i className="fa fa-shield text-dark mr-2"></i>
            <strong className="text-left">Kindly make payment to proceed</strong>
          </div>
        </div>
    
        {/* Intro */}
        <div className="row m-0 col-md-12 justify-content-start text-left mb-3">
          <div className="col-md-12 text-left">
            <p className="mb-0 text-muted text-left">
              You’re in full control of your funds at every step.
            </p>
          </div>
        </div>
    
        {/* Step 1 */}
        <div className="row m-0 col-md-12 justify-content-start text-left mb-3">
          <div className="col-md-12 text-left">
  
    
            <div className="row m-0 col-md-12 justify-content-start text-left p-0 ">
              <div className="col-md-12 text-muted text-left p-0 m-0 ">
                Tap <b className="text-left text-info"> Make Secure Payment </b> to begin the transaction securely.
              </div>
            </div>
    
          </div>
        </div>
    
        {/* Step 2 */}
        <div className="row m-0 col-md-12 justify-content-start text-left mb-3 p-0 ">
          <div className="col-md-12 text-left">
  
    
            <div className="row m-0 col-md-12 justify-content-start text-left p-0 ">
              <div className="col-md-12 text-muted text-left">
                Once youve made your payment, you can:
              </div>
            </div>
    
            <div className="row m-0 col-md-12 justify-content-start text-left p-0 ">
              <div className="col-md-12 text-left m-0 p-0 ">
                <ul className="mb-0 pl-1 text-left">
                  <li className="text-left">Approve and release funds after delivery</li>
                  <li className="text-left">Request a review incase delivery not done as per agreement</li>
                </ul>
              </div>
            </div>
    
          </div>
        </div>
    
        {/* Footer */}
        <div className="row m-0 col-md-12 p-0  justify-content-start text-left">
          <div className="col-md-12 text-left p-0">
            <div className="p-2 border rounded bg-light d-flex align-items-center justify-content-start text-left">
              <i className="fa fa-check-circle text-dark mr-2"></i>
              <span className="text-left">
                Built for a secure, transparent and stress-free experience.
              </span>
            </div>
          </div>
        </div>
    
      </div>
    );
  
    const isComplete = normalizeStatus(nextStatus) === "completed";
    if (isComplete && totalPaid <= 0) {
      MosyCard("", modalMessage);
      return;
    }

    MosyAlertCard({
      icon: isComplete ? "check-circle" : "flag",
      iconColor: isComplete ? "text-success" : "text-warning",
      message: isComplete
        ? "Approve this project and mark it as complete?"
        : "Send this project to under review?",
      yesLabel: "Yes",
      noLabel: "No",
      onYes: () => submitProjectStatus(nextStatus),
    });
  }

  function getStepIcon(state) {
    if (state === "done") return <i className="fa fa-check-circle"></i>;
    if (state === "active") return <i className="fa fa-dot-circle-o"></i>;
    return <i className="fa fa-circle-thin"></i>;
  }
  return (
    <div className="card elforge_mosy_card_v2 p-4">
      <div className="elforge_mosy_project_head_v6">
        <div className="row col-md-12 p-0 m-0 justify-content-between align-items-center">
          <div className="col-md-12 py-2">
            <h2 className="elforge_mosy_project_title_v6 col-md-12">{project?.project_name || "Project"}</h2>
            <div className="elforge_mosy_project_ref_v6">{project?.project_ref || project?.record_id || "-"}</div>
          </div>

          <div className={`elforge_mosy_status_badge_v6 ${statusMeta.className} col-md-12`}>
            <i className={statusMeta.icon}></i> {statusMeta.label}
          </div>
        </div>
      </div>

      <div className="text-center mb-3 d-none">
        <div className="elforge_mosy_title_v2">Project Status</div>
        <div className="elforge_mosy_sub_v2">{project?.project_ref || project?.record_id || "-"}</div>
      </div>

      <div className="elforge_mosy_progress_wrap_v4">
        <div className="elforge_mosy_progress_bar_v4">
          <div className="elforge_mosy_progress_fill_v4" style={{ width: `${Math.min(Math.max(progressPercent, 0), 100)}%` }}></div>
        </div>
        <div className="elforge_mosy_progress_text_v4">{`${toNum(progressPercent, 0)}% Complete - ${currentStepText}`}</div>
      </div>

      <div className="elforge_mosy_status_box_v4">
        <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
          <span>
            <i className="fa fa-lock"></i> Payment
          </span>
          <strong className={hasPayments ? "elforge_mosy_text_success" : ""}>{hasPayments ? "Paid" : "Pending"}</strong>
        </div>

        <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
          <span>
            <i className="fa fa-code"></i> Project
          </span>
          <strong className="elforge_mosy_text_active">{currentStatus || "pending"}</strong>
        </div>

        <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
          <span>
            <i className="fa fa-forward"></i> Next Step
          </span>
          <strong>{nextStep?.step_name || "All steps completed"}</strong>
        </div>
      </div>

      <div className="elforge_mosy_timeline_v3 mb-3">
        {steps.length === 0 && (
          <div className="elforge_mosy_step_item_v3">
            <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">...</div>
            <div className="elforge_mosy_step_text_v3">
              <div className="elforge_mosy_step_title_v3">No timeline steps yet</div>
            </div>
          </div>
        )}
        {steps.map((step, index) => {
          const state = getStepState(step, index, computedActiveStepIndex);
          const iconClass =
            state === "done"
              ? "elforge_mosy_step_done_v3"
              : state === "active"
              ? "elforge_mosy_step_active_v3"
              : "elforge_mosy_step_pending_v3";
              

          return (
            <div className="elforge_mosy_step_item_v3" key={step.record_id || `${step.step_name}-${index}`}>
              <div className={`elforge_mosy_step_icon_v3 ${iconClass}`}>
                {getStepIcon(state)}
              </div>
              <div className="elforge_mosy_step_text_v3">
                <div className="elforge_mosy_step_title_v3">{step.step_name || `Step ${index + 1}`}</div>
                <div className="elforge_mosy_step_sub_v3">{step.notes || ""} - {step.step_status}</div>
                {state === "active" && <div className="elforge_mosy_step_sub_v3">You are here</div>}
              </div>
            </div>
          );
        })}

      </div>

      <div className="elforge_mosy_docs_v5">
        {documents.length === 0 && (
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
            <span>
              <i className="fa fa-file"></i> Documents
            </span>
            <span>None</span>
          </div>
        )}

        {documents.map((doc) => (
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom" key={doc.record_id || doc.document_name}>
            <span>
              <i className="fa fa-file"></i> {doc.document_name || doc.doc_type || "Document"}
            </span>
            <a href={makeMediaUrl(doc.file_url)} target="_blank" rel="noreferrer">
              View
            </a>
          </div>
        ))}
      </div>

      {!showNoButtons && (
        <div className="elforge_mosy_action_box_v5">
          {canApprove && (
            <button
              className="btn w-100 elforge_mosy_btn_success_v5 mb-2 text-white"
              onClick={() => confirmProjectStatus("completed")}
              disabled={isSubmitting}
            >
              <i className="fa fa-check-circle"></i> {isSubmitting ? "Please wait..." : "Approve"}
            </button>
          )}

          {canReview && (
            <button
              className="btn w-100 elforge_mosy_btn_secondary_v4"
              onClick={() => confirmProjectStatus("under review")}
              disabled={isSubmitting}
            >
              <i className="fa fa-flag"></i> {isSubmitting ? "Please wait..." : "Send Review"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
