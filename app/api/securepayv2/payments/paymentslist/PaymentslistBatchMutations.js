
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const PaymentslistBatchMutations = {
"_projects_project_name_project_id": {"type":"join","table":"projects","link":"project_id:record_id","select":{"_projects_project_name_project_id":"project_name"}},
"_clients_client_name_client_id": {"type":"join","table":"clients","link":"client_id:record_id","select":{"_clients_client_name_client_id":"client_name"}}
};

export const listPaymentslistMutationKeys = {
"_projects_project_name_project_id": [],
"_clients_client_name_client_id": [],

};

export default listPaymentslistMutationKeys;
