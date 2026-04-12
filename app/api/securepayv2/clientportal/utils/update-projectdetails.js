import {
  magicRandomStr,
  mosyQddata,
  mosyQuickSel,
  mosyRightNow,
  mosySqlInsert,
  mosySqlUpdate,
} from "../../../apiUtils/dataControl/dataUtils";
import { mosySendSMS } from "../../../apiUtils/dataControl/send-sms";

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function toSafeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function buildRemark(existing, incoming) {
  const oldText = String(existing || "").trim();
  const newText = String(incoming || "").trim();

  if (!newText) return oldText;
  if (!oldText) return newText;
  return `${oldText} | ${newText}`;
}

export async function updateProjectPayment({ auth, payload }) {
  try {
    const projectId = String(payload?.project_id || "").trim();
    const paymentMode = String(payload?.payment_mode || "").trim() || "mpesa";
    const amount = String(payload?.amount || "").trim();
    const refNo = String(payload?.ref_no || "").trim() || magicRandomStr(10);
    const remark = String(payload?.remark || "").trim();

    if (!projectId) {
      return { success: false, message: "project_id is required" };
    }

    if (!amount || Number(amount) <= 0) {
      return { success: false, message: "amount must be greater than zero" };
    }

    // project_id can come as record_id or primkey
    let project = await mosyQddata("projects", "record_id", projectId);
    if (!project) {
      project = await mosyQddata("projects", "primkey", projectId);
    }

    if (!project) {
      return {
        success: false,
        message: `Project not found for project_id: ${projectId}`,
      };
    }

    const projectRecordId = project.record_id;
    const now = mosyRightNow();
    const safeAmount = toSafeNumber(amount, 0);
    const client =
      (project.client_id && (await mosyQddata("clients", "record_id", project.client_id))) ||
      (project.client_id && (await mosyQddata("clients", "primkey", project.client_id))) ||
      null;

    // 1) Insert payment transaction
    const paymentInsertObj = {
      record_id: magicRandomStr(7),
      project_id: projectRecordId,
      client_id: project.client_id || "",
      amount: safeAmount,
      payment_method: paymentMode,
      transaction_code: refNo,
      payer_name: String(payload?.payer_name || "").trim(),
      payer_phone: String(payload?.payer_phone || "").trim(),
      status: "completed",
      paid_at: now,
      created_at: now,
      bill_ref_no: refNo,
      hive_site_id: project.hive_site_id || auth?.hive_site_id || "",
      hive_site_name: project.hive_site_name || auth?.hive_site_name || "",
    };

    const paymentInsertRes = await mosySqlInsert("payments", paymentInsertObj, {});

    // 2) Find pending steps and mark complete (ordered by step_order desc)
    const pendingSteps = await mosyQuickSel(
        "project_steps",
        `WHERE project_id='${projectRecordId}' 
         AND LOWER(step_status)='pending' 
         ORDER BY step_order ASC 
         LIMIT 2`,
        "l"
      );

    let updatedStepsCount = 0;

    for (const step of pendingSteps) {
      const newNotes = buildRemark(step.notes, remark);

      await mosySqlUpdate(
        "project_steps",
        {
          step_status: "completed",
          notes: newNotes,
        },
        {},
        `primkey='${step.primkey}'`
      );

      updatedStepsCount += 1;
    }

    // 3) Recompute project progress/status and update project
    const allSteps = await mosyQuickSel(
      "project_steps",
      `WHERE project_id='${projectRecordId}'`,
      "l"
    );

    const totalSteps = allSteps.length;
    const completedSteps = allSteps.filter((s) => {
      const st = normalizeStatus(s.step_status);
      return st === "completed" || st === "done";
    }).length;

    const progressPercent =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    const nextProjectStatus =
      progressPercent >= 100 ? "completed" : normalizeStatus(project.status) || "active";

    await mosySqlUpdate(
      "projects",
      {
        progress_percent: progressPercent,
        status: nextProjectStatus,
      },
      {},
      `primkey='${project.primkey}'`
    );

    const updatedProject = await mosyQddata("projects", "primkey", project.primkey);
    const updatedProjectSteps = await mosyQuickSel(
      "project_steps",
      `WHERE project_id='${projectRecordId}' ORDER BY step_order DESC`,
      "l"
    );

    const latestPayments = await mosyQuickSel(
      "payments",
      `WHERE project_id='${projectRecordId}' ORDER BY primkey DESC`,
      "l"
    );

    // 4) Notify default admin number + client number
    const clientName = client?.client_name || "Client";
    const companyName = project?.contractor || "SecurePay";
    const smsMessage = `Hi ${clientName}, your payment of ${project?.currency || ""} ${amount} for "${project?.project_name || "your project"}" has been received successfully.

Your project is now progressing to the next stage. We'll keep you updated every step of the way.

Thank you for choosing ${companyName}.`;

    const smsRecipients = [
      "0710766390",
      String(client?.phone_number || "").trim(),
    ].filter(Boolean);

    const uniqueRecipients = [...new Set(smsRecipients)];
    const smsResults = [];

    for (const phone of uniqueRecipients) {
      const smsRes = await mosySendSMS(phone, smsMessage);
      smsResults.push({ phone, ...smsRes });
    }

    return {
      success: true,
      message: "Project payment updated successfully",
      data: {
        payment_insert: paymentInsertRes,
        project: updatedProject,
        updated_steps_count: updatedStepsCount,
        project_steps: updatedProjectSteps,
        payments: latestPayments,
        sms: smsResults,
      },
    };
  } catch (error) {
    console.error("Error in updateProjectPayment:", error);
    return {
      success: false,
      message: error?.message || "Operation failed",
    };
  }
}

