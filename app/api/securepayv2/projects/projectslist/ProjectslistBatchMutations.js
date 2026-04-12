
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const ProjectslistBatchMutations = {
"_clients_client_name_client_id": {"type":"join","table":"clients","link":"client_id:record_id","select":{"_clients_client_name_client_id":"client_name"}},
"documents": {"type":"count","table":"documents","link":"project_id:record_id"},
"steps": {"type":"count","table":"project_steps","link":"project_id:record_id"},
"total_payments": {"type":"sum","table":"payments","link":"project_id:record_id","column":"amount"}
};

export const listProjectslistMutationKeys = {
"_clients_client_name_client_id": [],
"documents": [],
"steps": [],
"total_payments": [],

};

export default listProjectslistMutationKeys;
