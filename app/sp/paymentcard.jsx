import { toNum } from "../MosyUtils/hiveUtils";
import { promptProjectPayment } from "./utils/promptStk";

function normalizeStatus(status) {
  return String(status || "").trim().toLowerCase();
}

function sortSteps(steps = []) {
  return [...steps].sort((a, b) => Number(a.step_order || 0) - Number(b.step_order || 0));
}

export function getStepState(step, index, activeIndex) {
  const status = normalizeStatus(step?.step_status);
  if (status === "completed" || status === "done") return "done";
  if (index === activeIndex) return "active";
  return "pending";
}

export default function PaymentCard({ data }) {
  const project = data?.project || {};
  const client = data?.client || {};
  const steps = sortSteps(data?.project_steps || []);

  const activeStepIndex = steps.findIndex((s) => normalizeStatus(s?.step_status) !== "completed");
  const computedActiveStepIndex = activeStepIndex === -1 ? steps.length - 1 : activeStepIndex;

  const providerName = project?.contractor || "Service Provider";
  const projectName = project?.project_name || "Project";
  const currency = project?.currency || "";
  const amount = toNum(project?.amount || 0, 2);

 function getStepIcon(state) {
    if (state === "done") return <i className="fa fa-check-circle"></i>;
    if (state === "active") return <i className="fa fa-dot-circle-o"></i>;
    return <i className="fa fa-circle-thin"></i>;
  }

  return (
    <div className="card elforge_mosy_card_v2 p-4 mb-4">
      <div className="mb-3 text-left">
        <h3 className="elforge_mosy_title_v2 py-3">
          {providerName} sent you a transparent payment request
        </h3>
        <div className="col-md-12 pb-2 h4 px-0"><b>Project : </b>{projectName}</div>
        <div className="elforge_mosy_sub_v2">Your progress so far</div>
      </div>

      <div className="elforge_mosy_timeline_v3 mb-3">
        {steps.length === 0 && (
          <div className="elforge_mosy_step_item_v3">
            <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">...</div>
            <div className="elforge_mosy_step_text_v3">
              <div className="elforge_mosy_step_title_v3">No steps yet</div>
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
     

      <div className="text-center mb-3">
        <h3 className="elforge_mosy_title_v2">Payment Request</h3>
        <div className="elforge_mosy_sub_v2">{projectName}</div>
      </div>

      <div className="elforge_mosy_amount_v4">
        <div className="elforge_mosy_amount_label_v4">Amount to Pay</div>
        <div className="elforge_mosy_amount_value_v4">{`${currency} ${amount}`.trim()}</div>
      </div>

      <div className="elforge_mosy_info_v4 mb-3">
        <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
          <span>
            <i className="fa fa-building mr-1"></i> Provider
          </span>
          <strong>{providerName}</strong>
        </div>

        <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
          <span>
            <i className="fa fa-shield mr-1"></i> Process
          </span>
          <strong>SecurePay</strong>
        </div>

        <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
          <span>
            <i className="fa fa-file mr-1"></i> Project
          </span>
          <strong>{projectName}</strong>
        </div>
      </div>

      <div className="elforge_mosy_input_group_v5">
        <label className="elforge_mosy_label_v5">
          <i className="fa fa-phone"></i> Phone Number
        </label>
        <div className="elforge_mosy_label_sub_v5">Enter the number registered with M-Pesa</div>
        <input
          id="txt_client_tel"
          name="txt_client_tel"
          className="elforge_mosy_input_v5"
          placeholder="e.g. 0712 345 678"
          defaultValue={client?.phone_number || ""}
        />
      </div>

      <div className="elforge_mosy_input_group_v5">
        <label className="elforge_mosy_label_v5">
          <i className="fa fa-user"></i> Full Name
        </label>
        <div className="elforge_mosy_label_sub_v5">Used for payment verification</div>
        <input
          className="elforge_mosy_input_v5"
          placeholder="e.g. John Mwangi"
          defaultValue={client?.client_name || ""}
        />
      </div>

      <div className="text-center mb-2">
        <i className="fa fa-shield"></i> After payment we will send you a receipt as proof of transaction
      </div>
      <button
          className="btn w-100 elforge_mosy_btn_primary_v4 text-white"
          onClick={() => promptProjectPayment(project)}
        >
          <i className="fa fa-mobile"></i> Pay for Project
        </button>

      <button className="btn w-100 elforge_mosy_btn_secondary_v4 d-none">
        <i className="fa fa-flag"></i> Request Review
      </button>
    </div>
  );
}
