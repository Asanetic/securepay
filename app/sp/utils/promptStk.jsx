import { closeMosyCard, MosyCard } from "../../components/MosyCard";
import { MosyNotify } from "../../MosyUtils/ActionModals";
import { mosyPostData } from "../../MosyUtils/hiveUtils";
import { getApiRoutes } from "../../securepayv2/AppRoutes/apiRoutesHandler";

const apiRoutes = getApiRoutes();
const PAYMENT_CHECK_INTERVAL_MS = 5000;
const PAYMENT_CHECK_TIMEOUT_MS = 3 * 60 * 1000;


function normalizeMpesaNumber(value = "") {
  return value.replace(/\s+/g, "");
}

function updatePromptStatus({ text = "", totalPaid = null, targetAmount = null }) {
    const statusEl = document.getElementById("mpesa_prompt_status");
    const totalEl = document.getElementById("mpesa_prompt_total_paid");
  
    if (statusEl && text) {
      statusEl.innerText = text;
    }
  
    if (totalEl && totalPaid !== null && targetAmount !== null) {
      totalEl.innerText = `${totalPaid.toFixed(2)} / ${targetAmount.toFixed(2)}`;
    }
  }


function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  function toNumber(value) {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

async function executeProjectStk(payload) {
  MosyNotify({
    id: "topmost",
    message: "Sending M-Pesa STK prompt...",
    icon: "refresh",
    addTimer: false
  });

  try {
    const res = await mosyPostData({
      url: apiRoutes.smartapi.base,
      data: {
        action: "promptMobileStk", //  NEW ACTION
        payload
      }
    });

    MosyNotify({
      id: "topmost",
      message: res?.message || "STK prompt sent",
      icon: "check-circle",
      addTimer: true
    });

    closeMosyCard("modal3");

    //show confirmation UI
    showProjectPromptSentCard(payload);

    // start watcher
    watchProjectPayment(payload);
    return res;

 } catch (err) {
        console.error("STK ERROR:", err);
      
        MosyNotify({
          id: "topmost",
          message: err?.message || "Failed to send STK prompt",
          icon: "exclamation-triangle",
          addTimer: false
        });
      }
}

export function promptProjectPayment(projectDetails = {}) {
  const projectId = projectDetails?.record_id;
  const amount = projectDetails?.amount || "";
  const currency = projectDetails?.currency || "";
  let mobile = normalizeMpesaNumber(
    document.getElementById("txt_client_tel")?.value || ""
  );
  console.log("🚀 ~ file: promptProjectPayment  ", projectDetails)

  closeMosyCard("modal3");
  closeMosyCard()

  if (!projectId) {
    MosyNotify({
      message: "Item details missing",
      icon: "exclamation-triangle"
    });
    return;
  }

  MosyCard(
    "Pay for Item",
    <div className="row col-md-12 m-0 p-0">

      <div className="col-md-12 text-left mb-3">
        <div><b>Paying for:</b> {projectDetails?.project_name}</div>
        <div><b>Provider:</b> {projectDetails?.contractor}</div>
        <div><b>Amount:</b> {`${currency} ${amount}`}</div>
      </div>

      <div className="col-md-12 mb-3">
        <label>M-Pesa Number</label>
        <input id="txt_mpesa_phone" className="form-control" defaultValue={mobile} />
      </div>

      <div className="col-md-12 text-right">
        <button className="btn btn-secondary mr-2" onClick={() => closeMosyCard("modal3")}>
          Cancel
        </button>

        <button
          className="btn btn-primary"
          onClick={async () => {
            mobile = normalizeMpesaNumber(
                document.getElementById("txt_mpesa_phone")?.value || ""
              );

            if (!mobile) {
              MosyNotify({
                message: "Enter phone number",
                icon: "exclamation-triangle"
              });
              return;
            }

            await executeProjectStk({
              project_id: projectId, //  KEY CHANGE
              mpesa_mobile_number: mobile,
              amount,
              currency,
              project_name: projectDetails?.project_name,
              client_id: projectDetails?.client_id
            });
          }}
        >
          Proceed 
        </button>
      </div>
    </div>,
    true,
    "modal3",
    "mosycard_medium"
  );
}

function showProjectPromptSentCard(payload = {}) {
    const accountNo = payload?.project_id || "-"; // ✅ project now
    const accountName = payload?.project_name || payload?.client_id || "-";
    const amount = `${payload?.currency || ""} ${payload?.amount || ""}`.trim() || "-";
    const securityCode = randomSecurityCode(10);
  
    MosyCard(
      "Payment Prompt Sent",
      <div className="mb-4 row justify-content-center m-0 p-0 col-md-12 pl-2 pr-2" style={{ lineHeight: "35px" }}>
        <div className="col-md-12 ctn_set">
          <div className="pt-2 row justify-content-center m-0 p-0 col-md-12">
  
            <h6 className="col-md-12 text-left p-0 m-0">
              Payment request sent. Check your phone to complete the transaction.
            </h6>
  
            <div className="pt-2 pb-2 border-bottom border_set row m-0 p-0 col-md-12">
              <div className="col-md-12 border-bottom bg-light mb-2 text-left">
                <b>Item Details</b>
              </div>
  
              <div className="col-md-4"><b>Payment ID:</b> {accountNo}</div>
              <div className="col-md-4"><b>Item:</b> {accountName}</div>
              <div className="col-md-4"><b>Security Code:</b> {securityCode}</div>
            </div>
  
            <div className="col-md-12 text-left pt-2">
              If you don’t see the STK prompt, use manual payment:
              <div className="pt-2"><b>Direct Lipa na M-Pesa</b></div>
            </div>
  
            <ol className="col-md-12 ml-4 text-left">
              <li>Go to Lipa na M-Pesa</li>
              <li>Select Paybill</li>
              <li>Enter <b className="text-danger">4091961</b></li>
              <li>Account: <b className="text-danger">{accountNo}</b></li>
              <li>Amount: <b className="text-danger">{amount}</b></li>
            </ol>
  
            <div className="col-md-12 text-left font-weight-bold mb-3 border-top border-bottom p-3">
              You’ll receive a receipt after payment confirmation.
            </div>
  
            <div className="col-md-12 text-left p-2 mb-3 border rounded">
              <div id="mpesa_prompt_status">
                <b>Waiting for payment confirmation...</b>
              </div>
              <div>
                <b>Paid so far:</b>{" "}
                <span id="mpesa_prompt_total_paid">
                  0.00 / {Number(payload?.amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
  
            <div className="col-md-12 text-center pt-2">
              <button className="btn btn-primary" onClick={() => closeMosyCard("modal4")}>
                Okay
              </button>
            </div>
  
          </div>
        </div>
      </div>,
      true,
      "modal4",
      "mosycard_wide"
    );
  }

  function randomSecurityCode(length = 10) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let out = "";
    for (let i = 0; i < length; i++) {
      out += chars[Math.floor(Math.random() * chars.length)];
    }
    return out;
  }


  async function fetchProjectPayments(projectId) {
    const token = btoa(String(projectId));
    const url = `https://apps.asanetic.com/eb/be/hiveapi.php?unused_credits=${encodeURIComponent(token)}`;
  
    const res = await fetch(url);
    const rawText = await res.text();
  
    let json = {};
    try {
      json = JSON.parse(rawText);
    } catch {
      json = {};
    }
  
    const list = Array.isArray(json?.data) ? json.data : [];
  
    const txns = list.map((item) => {
      const amount = toNumber(item?.amount ?? item?.[2] ?? 0);
      const trxId = item?.trx_id || item?.[0] || "";
      const accountId = item?.account_id || item?.BillRefNumber || item?.[7] || "";
      return { amount, trxId, accountId };
    });
  
    const totalPaid = txns.reduce((sum, t) => sum + toNumber(t.amount), 0);
  
    return {
      ok: res.ok,
      txns,
      totalPaid
    };
  }


  export async function watchProjectPayment(payload = {}) {
    const projectId = payload?.project_id;
    const targetAmount = toNumber(payload?.amount);

    

    const maxChecks = Math.floor(PAYMENT_CHECK_TIMEOUT_MS / PAYMENT_CHECK_INTERVAL_MS);
  
    for (let checkNo = 1; checkNo <= maxChecks; checkNo++) {
      try {
        updatePromptStatus({
          text: `Checking payment... (${checkNo}/${maxChecks})`,
          totalPaid: 0,
          targetAmount
        });
  
        const check = await fetchProjectPayments(projectId);
        const totalPaid = toNumber(check?.totalPaid);
  
        updatePromptStatus({
          text: `Waiting for payment... (${checkNo}/${maxChecks})`,
          totalPaid,
          targetAmount
        });
  
        if (totalPaid >= targetAmount) {
            const trxRefs = (check?.txns || [])
              .map((t) => (t?.trxId || "").trim())
              .filter(Boolean);
          
            const joinedRefNo = [...new Set(trxRefs)].join(",");
          
            updatePromptStatus({
              text: "Payment received. Finalizing...",
              totalPaid,
              targetAmount
            });
          
            await sendProjectPaymentUpdate({
              projectId,
              amount: targetAmount,
              refNo: joinedRefNo
            });
          
            MosyNotify({
              id: "topmost",
              message: "Payment confirmed. Item updated.",
              icon: "check-circle",
              addTimer: false
            });
          
            updatePromptStatus({
              text: "Payment confirmed successfully.",
              totalPaid,
              targetAmount
            });
          
            //  RELOAD PAGE
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          
            return true;
          }
  
      } catch (err) {
        updatePromptStatus({
          text: "Retrying payment check...",
          totalPaid: 0,
          targetAmount
        });
      }
  
      await sleep(PAYMENT_CHECK_INTERVAL_MS);
    }
  
    // ❌ TIMEOUT
    MosyNotify({
      id: "topmost",
      message: "No payment detected yet. Please try again later.",
      icon: "exclamation-triangle",
      addTimer: false
    });
  
    updatePromptStatus({
      text: "Timeout waiting for payment.",
      totalPaid: 0,
      targetAmount
    });
  
    return false;
  }

  async function sendProjectPaymentUpdate({ projectId, amount, refNo }) {
    return mosyPostData({
      url: apiRoutes.smartapi.base,
      data: {
        action: "updateProjectPayment", // 🔥 NEW ACTION
        payload: {
          project_id: projectId,
          payment_mode: "mpesa",
          amount: String(amount),
          ref_no: refNo || `AUTO-${projectId}`,
          remark: "Auto project payment confirmation"
        }
      }
    });
  }
