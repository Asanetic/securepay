import { mosyQddata, mosySqlUpdate } from "../../../apiUtils/dataControl/dataUtils";

function normalizeStatus(value) {
  return String(value || "").trim().toLowerCase();
}

function mapIncomingStatus(status) {
  const s = normalizeStatus(status);

  if (s === "complete" || s === "completed" || s === "done") {
    return "completed";
  }

  if (s === "under review" || s === "under_review" || s === "review") {
    return "under review";
  }

  return s || "active";
}

export async function updateProjectstatus({ payload }) {
  try {
    const projectId = String(payload?.project_id || "").trim();
    const targetStatus = mapIncomingStatus(payload?.status);

    if (!projectId) {
      return { success: false, message: "project_id is required" };
    }

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

    const updateObj = {
      status: targetStatus,
    };

    if (targetStatus === "completed") {
      updateObj.progress_percent = 100;
    }

    await mosySqlUpdate(
      "projects",
      updateObj,
      {},
      `primkey='${project.primkey}'`
    );

    const updatedProject = await mosyQddata("projects", "primkey", project.primkey);

    return {
      success: true,
      message: "Project status updated successfully",
      data: {
        project: updatedProject,
      },
    };
  } catch (error) {
    console.error("Error in updateProjectstatus:", error);
    return {
      success: false,
      message: error?.message || "Operation failed",
    };
  }
}
