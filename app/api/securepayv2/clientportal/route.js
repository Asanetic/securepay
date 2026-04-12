import { base64Decode, base64Encode, mosySecureSelect } from "../../apiUtils/dataControl/dataUtils";

const projectDictionary = {
  NodeId: "record_id",
  clientId: "client_id",
  projectName: "project_name",
  projectRef: "project_ref",
  amount: "amount",
  currency: "currency",
  status: "status",
  progressPercent: "progress_percent",
  createdAt: "created_at",
  contractor: "contractor",
  hiveSiteId: "hive_site_id",
  hiveSiteName: "hive_site_name",
};

const clientDictionary = {
  NodeId: "record_id",
  clientName: "client_name",
  phoneNumber: "phone_number",
  email: "email",
  nationalId: "national_id",
  createdAt: "created_at",
  hiveSiteId: "hive_site_id",
  hiveSiteName: "hive_site_name",
  industry: "industry",
  referralSource: "referral_source",
};

const documentsDictionary = {
  NodeId: "record_id",
  projectId: "project_id",
  clientId: "client_id",
  docType: "doc_type",
  fileUrl: "file_url",
  status: "status",
  createdAt: "created_at",
  hiveSiteId: "hive_site_id",
  hiveSiteName: "hive_site_name",
  documentName: "document_name",
};

const projectStepsDictionary = {
  NodeId: "record_id",
  projectId: "project_id",
  stepName: "step_name",
  stepStatus: "step_status",
  stepOrder: "step_order",
  notes: "notes",
  createdAt: "created_at",
  hiveSiteId: "hive_site_id",
  hiveSiteName: "hive_site_name",
};

const paymentsDictionary = {
  NodeId: "record_id",
  projectId: "project_id",
  clientId: "client_id",
  amount: "amount",
  paymentMethod: "payment_method",
  transactionCode: "transaction_code",
  payerName: "payer_name",
  payerPhone: "payer_phone",
  status: "status",
  paidAt: "paid_at",
  createdAt: "created_at",
  billRefNo: "bill_ref_no",
  hiveSiteId: "hive_site_id",
  hiveSiteName: "hive_site_name",
};

function buildSearchParams(filters = {}, extra = {}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, base64Encode(String(value)));
  }

  for (const [key, value] of Object.entries(extra)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }

  return params;
}

async function fetchRows(table, dictionary, filters = {}, extra = {}) {
  const result = await mosySecureSelect({
    table,
    recordIdColumn: "record_id",
    dictionary,
    searchParams: buildSearchParams(filters, extra),
    defaultOrderColumn: "primkey"
  });

  return result?.data || [];
}

async function fetchLinkedRowsByProjectId(table, dictionary, project) {
  const candidateProjectIds = [project?.record_id, project?.primkey].filter(
    (v, i, arr) => v && arr.indexOf(v) === i
  );

  const merged = [];
  const seen = new Set();

  for (const projectId of candidateProjectIds) {
    const rows = await fetchRows(
      table,
      dictionary,
      { projectId },
      { pageSize: 100, pageNo: 1 }
    );

    for (const row of rows) {
      const dedupeKey = row.record_id || row.primkey || JSON.stringify(row);
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      merged.push(row);
    }
  }

  return merged;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const encodedProjectKey =searchParams.get("spid");

    if (!encodedProjectKey) {
      return Response.json(
        {
          status: "error",
          message: "Missing base64 project key. Use projectKey or project_key in query params.",
        },
        { status: 400 }
      );
    }

    const decodedProjectPrimkey = base64Decode(encodedProjectKey)?.trim();

    if (!decodedProjectPrimkey) {
      return Response.json(
        { status: "error", message: "Invalid project key." },
        { status: 400 }
      );
    }

    const projectRows = await fetchRows(
      "projects",
      projectDictionary,
      { Node: decodedProjectPrimkey },
      { pageSize: 1, pageNo: 1 }
    );

    const project = projectRows[0] || null;

    if (!project) {
      return Response.json(
        {
          status: "error",
          message: "Project not found for supplied key.",
          data: {
            project: null,
            client: null,
            documents: [],
            project_steps: [],
            payments: [],
          },
        },
        { status: 404 }
      );
    }

    let client = null;
    if (project.client_id) {
      const clientByRecordId = await fetchRows(
        "clients",
        clientDictionary,
        { NodeId: project.client_id },
        { pageSize: 1, pageNo: 1 }
      );

      client = clientByRecordId[0] || null;

      if (!client) {
        const clientByPrimkey = await fetchRows(
          "clients",
          clientDictionary,
          { Node: project.client_id },
          { pageSize: 1, pageNo: 1 }
        );
        client = clientByPrimkey[0] || null;
      }
    }

    let documents = [];
    let projectSteps = [];
    let payments = [];

    if (project.record_id || project.primkey) {
      documents = await fetchLinkedRowsByProjectId(
        "documents",
        documentsDictionary,
        project
      );

      projectSteps = await fetchLinkedRowsByProjectId(
        "project_steps",
        projectStepsDictionary,
        project
      );

      payments = await fetchLinkedRowsByProjectId(
        "payments",
        paymentsDictionary,
        project
      );
    }

    return Response.json({
      status: "success",
      message: "Client portal project data retrieved",
      data: {
        project,
        client,
        documents,
        project_steps: projectSteps,
        payments,
      },
    });
  } catch (err) {
    console.error("GET clientportal failed:", err);
    return Response.json(
      { status: "error", message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
