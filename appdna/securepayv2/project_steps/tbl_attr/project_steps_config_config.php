<?php
//a.I tAKE NOTE : SUPER IMPORTTANT NOTE : ON YOUR FINAL RESULT DO NOT DELETE COMMENTED CODE

////1. project_steps

//"primkey" , "record_id" , "project_id" , "step_name" , "step_status" , "step_order" , "notes" , "created_at" , "hive_site_id" , "hive_site_name" , <br><br>

//{{table_cols_head}}

  
//Important A.I notes below 
  
//important columns on list : record_id, project_id, step_name, step_status, step_order, created_at    
//important columns on profile : record_id, project_id, step_name, step_status, step_order, notes, created_at    

/*================= How the module related to the whole app / app flow ==================== 

This module manages project workflow steps within the application. It tracks each step
of a project lifecycle, including sequencing, status updates, and notes for execution.

Key relationships:
- Linked to projects via project_id
- Enables workflow tracking and progress monitoring
- Supports operational visibility per project

================= How the module related to the whole app / app flow ==================== */

/// A.I. NOTES : create $primary_table__ config file inplace of app_users please dont omit any keys or variables rewrite new values with code leave keys intact, dont delete commented code , where possible replace it with new commented values if you are capable .
//A.I Notes  : max list col should be have 7 data important and relevant columns  , skip_cols_list the rest. eg if table have 20 cols  "skip_cols_list" => ["hive_site_id","hive_site_name", + the 13 cols ],  hive_site_id and hive_site_name should always be skipped in skip_cols_list skip_cols_profile

  // =========================
  // Core definitions
  // =========================
  $primary_table__="project_steps";
  $__page_title ="Project steps list";

  $core_module_configs_=[

    //important
    "primary_table"=>$primary_table__,
    "table_alias" =>"projectsteps",     
    "primary_key"=>"primkey",
    "record_id"=>"record_id",
    "main_page_title"=>$__page_title,
    "api_endpoint_name"=>"projectsteps",
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

      "data1" => "step_name",      
      "data2" => "step_status",          
      "data3" => "step_order",     
      "data4" => "created_at"                

  ];


  /*
  |--------------------------------------------------------------------------
  | Example 2: Profile Dictionary
  |--------------------------------------------------------------------------
  | Notice same data slots, different column mapping.
  */

  $profile_dictionary = [

      "data1" => "step_name",               
      "data2" => "step_status",         
      "data3" => "step_order",         
      "data4" => "notes"         

  ];


  $input_prefix="";

  $novanest_module_ui_blueprint_ = [

    // =========================
    // Database schema section
    // =========================
    "db_schema" => [

        // Extra table columns dont use for now 
        "custom_tbl_cols" => [
           //"project_steps" => ["project_name"]
        ],

        // Default values for profile | dont use for now
        "custom_profile_default_data" => [
            //"step_status" => "checkblank(getarr_val_(\$project_steps_node,'step_status'),'pending')"
        ],

        "dataRowMutations"=>[

         /* "project_name" => [
              "type" => "single",
              "table" => "projects",
              "link"  => "record_id:project_id",
              "column" => "project_name"
          ]*/ 
                 
          
        ],

      
    ],


    // =========================
    // UI schema section
    // =========================
    "page_layout" => [

        // Column order
        "desired_column_order" => [
            "project_steps" => ["primkey","record_id","project_id","step_name","step_status","step_order","notes","created_at"]
        ],

        // Grouped inputs
        "form_input_segmentation_arr" => [
            "project_steps" => [
                "Step Details" => ["project_id","step_name","step_status","step_order"],
                "Notes" => ["notes"]
            ]
        ],


        "image_columns" => [],
        "default_col_class" => "col-md-4",
        "hidden_inputs" => ["created_at"], 
        "print_tables" => ["project_steps"], 
        "skip_cols_profile" => ["hive_site_id","hive_site_name"], 
        "skip_cols_list" => ["hive_site_id","hive_site_name","notes"],  
        "running_bal_col_tbl" => [],
        "grid_tbl" => [], 
        "view_tbl_only" => [],
        "sum_cols_list" => [], 
        "textarea_array" => ["notes"], 
        "content_editable" => [], 

        "static_drop_down_array" => [
            "step_status" => "pending,in-progress,completed,blocked"
        ],

        "dynamic_drop_down_array" => [], 
        "password_columns" => [], 
        "title_columns" => [], 
        "date_columns" => [],
        "datetime_columns" => ["created_at"],

        "rename_cols_array" => [ 
            "created_at" => "Created date",
            "project_id" => "Project"
        ],

        "rename_tables_array" => [
            "project_steps" => "Project Steps"
        ],

        "new_label_buttons_arr" => [ 
            "project_steps" => "list-check:New Step:{`Step / \${project_stepsNode?.step_name}`}" 
        ],

        "profile_pic_style" => "width:120px; height:120px; border-radius:10%;"
    ],
    
    "import"=>[
      "project_steps"=>["csv"=>"project_id,step_name,step_status,step_order,notes","record_id"=>""]
    ],

    // =========================
    // Behaviour schema section
    // =========================
    "data_behaviour" => [
        //this will add cehck boxes on each row   
       "add_grid_check_boxes"=>[
          "project_steps_"=>"loadProjectSteps()"
        ],
                 
        //Ai Notes  dont clear this custom_multi_grid_rows instead customize if possible
        "custom_multi_grid_rows" => [
          /*"project_steps_list"=>[
            "table"=>"project_steps",
            "link"=>"project_steps_list",
            "query"=>"project_id='{{project_id}}'",
            "title"=>"Project Steps",
            "columns"=>["step_name","step_status","step_order"]
          ]*/
        ], 
      
        "custom_profile_col_data" => [
          //"project_name"=>"?"
        ], 
      
        "custom_profile_default_data" => [],
        "connection_cols" => [ 
           "project_id" => "projects:record_id:project_name:apiRoutes.projectslist.base"
        ]
    ]
  
  ];

//filterfile, title, table, column
  /// Ai Notes  button you want on the list page dont remove commented code replace instead
  $list_btn_table_array=[
      $primary_table__=>[
         /*"filter: Filter by Step Status" => [
             "fe" => "filterByStepStatus()",
             "file" => "project-steps-filters"
         ]*/      
      ],  
  ];

  /// Ai Notes buttons you want on the profile /form page dont remove commented code replace instead
  $profile_btn_table_array=[
      $primary_table__=>[
         /*"play: Start Step" => [
             "fe" => "startStep(project_stepsNode)",
             "file" => "project-step-actions"
         ]*/        
      ],
  ];

  ////Ai Notes  on each row you add more actions eg, view collections, send message dont remove commented code replace instead
  $global_new_drop_down_link_arr = [
        $primary_table__=>[
         /*"eye: View Step Details" => [
             "fe" => "viewStepDetails(listproject_steps_result.record_id)",
             "file" => "project-step-details"
         ]*/        
      ]
  ];

  ///Ai Notes  append mini list for interlinked data eg farmers & collections dont remove commented code replace instead
  $interlink_lists=[
  /* "projectSteps"=>[ 
     "filter_str"=>" project_id='\${project_stepsNode?.project_id}'  ",
     "module_name"=>"ProjectSteps",
     "list_title"=>"Project Steps",
     "custom"=>false,
     "external"=>true,
     "alias"=>'project_steps'
   ]*/
  ];
   
  ///Ai Notes append mini profile for interlinked data dont remove commented code replace instead
  $interlink_profile=[
   
   /*"linkedProject"=>[ 
     "filter_str"=>"record_id='{project_stepsNode?.project_id}'",
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
