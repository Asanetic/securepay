<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

//Table name : payments

// columns : "primkey" , "record_id" , "project_id" , "client_id" , "amount" , "payment_method" , "transaction_code" , "payer_name" , "payer_phone" , "status" , "paid_at" , "created_at" , "hive_site_id" , "hive_site_name" , "bill_ref_no" , 

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, project_id, client_id, amount, payment_method, status, paid_at    
//important columns on profile : record_id, project_id, client_id, amount, payment_method, transaction_code, payer_name, payer_phone, status, paid_at, created_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages all payments within the application. It handles transaction tracking,
payment processing records, and reconciliation. Payments are linked to both projects and clients,
ensuring financial traceability across the system.

Key relationships:
- Linked to projects via project_id
- Linked to clients via client_id
- Used in billing, reporting, and financial summaries

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="payments";
  $__page_title ="Payments list";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"payments",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"payments",
    "multigrid_col_span"=>"9"      

  ];
  
  $modules_and_links_=[
 
    //form data page eg users/profile leave as profile    
    "profile_module_name"=>"profile", 
    "profile_module_link"=>"./profile",
    "addnew_page_link"=>"./profile",
    
    //list / grid data page eg users/list leave as list
    "list_module_name"=>"list", 
    "list_page_link"=>"./list",
    "write_profile"=>true,
    "write_list"=>true
    
  ];

  $profile_file_name   = $modules_and_links_["profile_module_name"];
  $list_file_name      = $modules_and_links_["list_module_name"];
  $back_to_list_       = $modules_and_links_["list_page_link"];
  $add_new_page_link   = $modules_and_links_["addnew_page_link"];


  //custom grid ui template code paths
  //$list_template= file_get_contents('../novatemplates/dna_user_card_list.tdna');
  //$list_template= file_get_contents('../novatemplates/dna_grid3.tdna');
  
  //custom profile ui template path
  //$profile_template= file_get_contents('../novatemplates/bgprofile.tdna');
  //$profile_template= file_get_contents('../novatemplates/profile8.tdna');

  /*
  The data Dictionary only applies if you selected a custom list ($csgrid_dictionary) or profile ($profile_dictionary) template 
  $for list we use $list_template for profile we use $profile_dictionary. Dont uncomment if you dont have the template
  if not selected the compiler defaults to the inbuild template
  |--------------------------------------------------------------------------
  | Example 1: Grid Dictionary
  |--------------------------------------------------------------------------
  | These can map to ANY table columns.
  */

  $csgrid_dictionary = [

      "data1" => "payer_name",      
      "data2" => "amount",          
      "data3" => "payment_method",     
      "data4" => "status"                

  ];


  /*
  |--------------------------------------------------------------------------
  | Example 2: Profile Dictionary
  |--------------------------------------------------------------------------
  | Notice same data slots, different column mapping.
  */

  $profile_dictionary = [

      "data1" => "payer_name",               
      "data2" => "transaction_code",         
      "data3" => "amount",         
      "data4" => "status"         

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"payments" => ["project_name","client_name"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "checkblank(getarr_val_(\$payments_node,'status'),'pending')"
        ],

        "dataRowMutations"=>[

         /* "project_name" => [
              "type" => "single",
              "table" => "projects",
              "link"  => "record_id:project_id",
              "column" => "project_name"
          ],
          "client_name" => [
              "type" => "single",
              "table" => "clients",
              "link"  => "record_id:client_id",
              "column" => "full_name"
          ]*/ 
                 
          
        ],

      
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "payments" => ["primkey","record_id","project_id","client_id","amount","payment_method","transaction_code","payer_name","payer_phone","status","paid_at","created_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "payments" => [
                "Payment Details" => ["payer_name","payer_phone","amount","payment_method","transaction_code"],
                "References" => ["project_id","client_id","bill_ref_no"],
                "Status & Dates" => ["status","paid_at","created_at"]
            ]
        ],


        "image_columns" => [],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["payments"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","payer_phone","created_at"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => ["amount"], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "status" => "pending,paid,failed,refunded",
            "payment_method" => "cash,mpesa,bank,card"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => ["paid_at"],
        "datetime_columns" => ["created_at"],

        "rename_cols_array" => [ 
            "paid_at" => "Payment date",
            "client_id" => "Client",
            "project_id" => "Project"
        ],

        "rename_tables_array" => [
            "payments" => "Payments"
        ],

        "new_label_buttons_arr" => [ 
            "payments" => "credit-card:New Payment:{`Payment / \${paymentsNode?.record_id}`}" 
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "payments"=>["csv"=>"project_id,client_id,amount,payment_method,transaction_code,payer_name,payer_phone,status,paid_at","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        //this will add cehck boxes on each row   
       "add_grid_check_boxes"=>[
          "payments_"=>"loadPayments()"
        ],
                 
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /*"related_payments"=>[
            "table"=>"payments",
            "link"=>"payments_list",
            "query"=>"client_id='{{client_id}}'",
            "title"=>"Client Payments",
            "columns"=>["paid_at","amount","payment_method","status"]
          ]*/
        ], 
      
        "custom_profile_col_data" => [
          //"project_name"=>"?","client_name"=>"?"
        ], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "project_id" => "projects:record_id:project_name:apiRoutes.projectslist.base",
           "client_id" => "clients:record_id:client_name:apiRoutes.clientledger.base"
        ]
    ]
  
  ];

//filterfile, title, table, column
  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         /*"filter: Filter by Payment Status" => [
             "fe" => "filterByPaymentStatus()",
             "file" => "payment-filters"
         ]*/      
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         /*"receipt: Generate Receipt" => [
             "fe" => "generateReceipt(paymentsNode)",
             "file" => "payment-receipt"
         ]*/        
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Payment Details" => [
             "fe" => "viewPaymentDetails(listpayments_result.record_id)",
             "file" => "payment-details"
         ]*/        
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
  /* "projectPayments"=>[ 
     "filter_str"=>" project_id='\${paymentsNode?.project_id}'  ",
     "module_name"=>"Payments",
     "list_title"=>"Project Payments",
     "custom"=>false,
     "external"=>true,
     "alias"=>'payments'
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedProject"=>[ 
     "filter_str"=>"record_id='{paymentsNode?.project_id}'",
     "module_name"=>"Projects",
     "profile_title"=>"Project Details",
     "custom"=>false,
     "external"=>true,
     "alias"=>'projects'
   ]*/
   
  ];  

  ///for interlinked data included as component
  $customProfileData="{}";

  ///=================================== basic template setup 

  $override_def_col_size="col-md-4 hive_data_cell ";
  $override_segmentation_section_class="col-md-11 bg-white border border_set shadow-md p-4 mb-4 hive_form_section";

  $additional_details_segment_title="";

  $col_size_def='col-md-12';

  $def_profile_container_class="col-md-12 rounded text-left p-2 mb-0  bg-white ";
  $def_profile_inner_container_class='` profile_container col-md-12 m-0 p-0  ${showNavigationIsle &&("pr-lg-4 pl-lg-4 m-0")}`';  
  $override_justify_class="justify-content-start";
  $overide_img_section_class="col-md-6 mr-lg-5";
  $override_large_col_size="col-md-12 hive_data_cell";
  $image_style_="product_image";
  $image_upload_btn_class="";
  $mutations=$novanest_module_ui_blueprint_["db_schema"]["dataRowMutations"]
  ///=================================== basic template setup 

?>
