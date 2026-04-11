<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. documents

//"primkey" , "record_id" , "project_id" , "client_id" , "doc_type" , "file_url" , "status" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, doc_type, project_id, client_id, status, file_url, created_at    
//important columns on profile : record_id, project_id, client_id, doc_type, file_url, status, created_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages documents within the application. It handles document uploads,
storage references, and status tracking. Documents are linked to both projects and clients,
providing centralized access to important files across the system.

Key relationships:
- Linked to projects via project_id
- Linked to clients via client_id
- Supports file storage and retrieval workflows

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="documents";
  $__page_title ="Documents list";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"documents",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"documents",
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

      "data1" => "doc_type",      
      "data2" => "file_url",          
      "data3" => "status",     
      "data4" => "created_at"                

  ];


  /*
  |--------------------------------------------------------------------------
  | Example 2: Profile Dictionary
  |--------------------------------------------------------------------------
  | Notice same data slots, different column mapping.
  */

  $profile_dictionary = [

      "data1" => "doc_type",               
      "data2" => "file_url",         
      "data3" => "status",         
      "data4" => "created_at"         

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"documents" => ["project_name","client_name"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"status" => "checkblank(getarr_val_(\$documents_node,'status'),'pending')"
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
            "documents" => ["primkey","record_id","project_id","client_id","doc_type","file_url","status","created_at"]
        ],
//Table name : documents

// columns : "primkey" , "record_id" , "project_id" , "client_id" , "doc_type" , "file_url" , "status" , "created_at" , "hive_site_id" , "hive_site_name" , "document_name" , 


        // Grouped inputs
        "form_input_segmentation_arr" => [
            "documents" => [
                "Document Details" => ["document_name","doc_type","file_url"],
                "References" => ["project_id","client_id"],
                "Status & Dates" => ["status","created_at"]
            ]
        ],


        "image_columns" => ["file_url"],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => [], 
        "print_tables" => ["documents"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => [], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "status" => "active,archived,pending"
         ],

        "dynamic_drop_down_array" => ["doc_type"], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => ["created_at"],

        "rename_cols_array" => [ 
            "created_at" => "Uploaded date",
            "client_id" => "Client",
            "project_id" => "Project",
            "document_name" =>"File name:col-md-8",
            "doc_type"=>"File category:col-md-4"
        ],

        "rename_tables_array" => [
            "documents" => "Documents"
        ],

        "new_label_buttons_arr" => [ 
            "documents" => "file-plus:New Document:{`Document / \${documentsNode?.doc_type}`}" 
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "documents"=>["csv"=>"project_id,client_id,doc_type,file_url,status","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        //this will add cehck boxes on each row   
       "add_grid_check_boxes"=>[
          "documents_"=>"loadDocuments()"
        ],
                 
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /*"related_documents"=>[
            "table"=>"documents",
            "link"=>"documents_list",
            "query"=>"project_id='{{project_id}}'",
            "title"=>"Project Documents",
            "columns"=>["doc_type","status","created_at"]
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
         /*"filter: Filter by Document Type" => [
             "fe" => "filterByDocType()",
             "file" => "document-filters"
         ]*/      
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         /*"download: Download File" => [
             "fe" => "downloadDocument(documentsNode?.file_url)",
             "file" => "document-download"
         ]*/        
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Document" => [
             "fe" => "viewDocument(listdocuments_result.file_url)",
             "file" => "document-viewer"
         ]*/        
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
  /* "projectDocuments"=>[ 
     "filter_str"=>" project_id='\${documentsNode?.project_id}'  ",
     "module_name"=>"Documents",
     "list_title"=>"Project Documents",
     "custom"=>false,
     "external"=>true,
     "alias"=>'documents'
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedProject"=>[ 
     "filter_str"=>"record_id='{documentsNode?.project_id}'",
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

  $override_def_col_size="col-md-6 hive_data_cell ";
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
