
/**
 * AUTO-GENERATED BATCH MUTATIONS
 * DO NOT EDIT MANUALLY
 */

export const ClientledgerBatchMutations = {
"projects": {"type":"count","table":"projects","link":"client_id:record_id"},
"total_payments": {"type":"sum","table":"payments","link":"client_id:record_id","column":"amount"}
};

export const listClientledgerMutationKeys = {
"projects": [],
"total_payments": [],

};

export default listClientledgerMutationKeys;
