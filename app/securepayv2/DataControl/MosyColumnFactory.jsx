const MosyColumnFactory = {

   //-- clients cols--//
  clients: ["record_id", "client_name", "phone_number", "email", "national_id", "created_at", "hive_site_id", "hive_site_name", "industry", "referral_source"],

   //-- documents cols--//
  documents: ["record_id", "project_id", "client_id", "doc_type", "file_url", "status", "created_at", "hive_site_id", "hive_site_name", "document_name"],

   //-- mosy_sql_roll_back cols--//
  mosy_sql_roll_back: ["roll_bk_key", "table_name", "roll_type", "where_str", "roll_timestamp", "value_entries", "hive_site_id", "hive_site_name"],

   //-- page_manifest_ cols--//
  page_manifest_: ["manikey", "page_group", "site_id", "page_url", "hive_site_id", "hive_site_name", "project_id", "project_name"],

   //-- payments cols--//
  payments: ["record_id", "project_id", "client_id", "amount", "payment_method", "transaction_code", "payer_name", "payer_phone", "status", "paid_at", "created_at", "hive_site_id", "hive_site_name", "bill_ref_no"],

   //-- project_activity cols--//
  project_activity: ["record_id", "project_id", "activity_type", "description", "created_at", "hive_site_id", "hive_site_name"],

   //-- project_steps cols--//
  project_steps: ["record_id", "project_id", "step_name", "step_status", "step_order", "notes", "created_at", "hive_site_id", "hive_site_name"],

   //-- projects cols--//
  projects: ["record_id", "client_id", "project_name", "project_ref", "amount", "currency", "status", "progress_percent", "created_at", "hive_site_id", "hive_site_name", "contractor"],

   //-- system_module_manifest_ cols--//
  system_module_manifest_: ["record_id", "component_name", "module_key", "module_name", "permission_type", "capability_key", "access_name", "relative_path", "hive_site_id", "hive_site_name"],

   //-- system_role_bundles cols--//
  system_role_bundles: ["record_id", "bundle_id", "bundle_name", "remark", "hive_site_id", "hive_site_name"],

   //-- system_users cols--//
  system_users: ["record_id", "name", "email", "tel", "login_password", "ref_id", "regdate", "user_no", "user_pic", "user_gender", "last_seen", "about", "hive_site_id", "hive_site_name", "auth_token", "token_status", "token_expiring_in", "project_id", "project_name", "user_role"],

   //-- tasks cols--//
  tasks: ["record_id", "project_id", "task_name", "task_status", "assigned_to", "priority", "due_date", "created_at", "hive_site_id", "hive_site_name"],

   //-- user_bundle_role_functions cols--//
  user_bundle_role_functions: ["record_id", "bundle_id", "bundle_name", "role_id", "role_name", "remark", "hive_site_id", "hive_site_name"],

   //-- user_manifest_ cols--//
  user_manifest_: ["admin_mkey", "user_id", "user_name", "role_id", "site_id", "role_name", "hive_site_id", "hive_site_name", "project_id", "project_name"],


};
export default MosyColumnFactory;