export default function StatusCard() {
    return (
      // <!-- ===== STATUS CARD ===== -->
      <div className="card elforge_mosy_card_v2 p-4">

      
      <div className="elforge_mosy_project_head_v6">
      
          <div className="row col-md-12 p-0 m-0  justify-content-between align-items-center">
      
              <div className="col-md-12 py-2">
                  <h2 className="elforge_mosy_project_title_v6 col-md-12">
                      Website Design – Daniel Hardware
                  </h2>
                  <div className="elforge_mosy_project_ref_v6">
                      SecurePay-2288
                  </div>
              </div>
      
              <div className="elforge_mosy_status_badge_v6 elforge_mosy_status_pending col-md-12">
                  <i className="fa fa-clock"></i> Awaiting Payment
              </div>
      
          </div>
      
      </div>
        
      
      <div className="elforge_mosy_project_head_v6 d-none ">
      
          <div className="d-flex justify-content-between align-items-center">
      
              <div>
                  <div className="elforge_mosy_project_title_v6">
                      Website Design – Daniel Hardware
                  </div>
                  <div className="elforge_mosy_project_ref_v6">
                      SecurePay-2288
                  </div>
              </div>
      
              <div className="elforge_mosy_status_badge_v6 elforge_mosy_status_active">
                  <i className="fa fa-circle-check"></i> In Progress
              </div>
      
          </div>
      
      </div>
        
          {/* <!-- HEADER --> */}
          <div className="text-center mb-3">
              <div className="elforge_mosy_title_v2">Project Status</div>
              <div className="elforge_mosy_sub_v2">
                  SecurePay-2288
              </div>
          </div>
      
          {/* <!-- PROGRESS BAR --> */}
          <div className="elforge_mosy_progress_wrap_v4">
              <div className="elforge_mosy_progress_bar_v4">
                  <div className="elforge_mosy_progress_fill_v4"></div>
              </div>
              <div className="elforge_mosy_progress_text_v4">
                  45% Complete • Currently in Development
              </div>
          </div>
      
          {/* <!-- STATUS SUMMARY --> */}
          <div className="elforge_mosy_status_box_v4">
      
              <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
                  <span><i className="fa fa-lock"></i> Payment</span>
                  <strong className="elforge_mosy_text_success">Funds Secured</strong>
              </div>
      
              <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
                  <span><i className="fa fa-code"></i> Project</span>
                  <strong className="elforge_mosy_text_active">In Development</strong>
              </div>
      
              <div className="elforge_mosy_status_item_v4 py-2 border-bottom">
                  <span><i className="fa fa-forward"></i> Next Step</span>
                  <strong>Preview Phase</strong>
              </div>
      
          </div>
      
          {/* <!-- TIMELINE --> */}
          <div className="elforge_mosy_timeline_v3 mb-3">
      
              <div className="elforge_mosy_step_item_v3">
                  <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_done_v3">✓</div>
                  <div className="elforge_mosy_step_text_v3">
                      <div className="elforge_mosy_step_title_v3">Payment Completed</div>
                      <div className="elforge_mosy_step_sub_v3">Client successfully paid via M-Pesa</div>
                  </div>
              </div>
      
              <div className="elforge_mosy_step_item_v3">
                  <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_done_v3">✓</div>
                  <div className="elforge_mosy_step_text_v3">
                      <div className="elforge_mosy_step_title_v3">Funds Secured</div>
                      <div className="elforge_mosy_step_sub_v3">Funds safely held in SecurePay escrow</div>
                  </div>
              </div>
      
              <div className="elforge_mosy_step_item_v3">
                  <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_active_v3">●</div>
                  <div className="elforge_mosy_step_text_v3">
                      <div className="elforge_mosy_step_title_v3">Project Development</div>
                      <div className="elforge_mosy_step_sub_v3">Design & development in progress</div>
                  </div>
              </div>
      
              <div className="elforge_mosy_step_item_v3">
                  <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
                  <div className="elforge_mosy_step_text_v3">
                      <div className="elforge_mosy_step_title_v3">Review</div>
                      <div className="elforge_mosy_step_sub_v3">Client preview & feedback stage</div>
                  </div>
              </div>
      
              <div className="elforge_mosy_step_item_v3">
                  <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
                  <div className="elforge_mosy_step_text_v3">
                      <div className="elforge_mosy_step_title_v3">Approval & Launch</div>
                      <div className="elforge_mosy_step_sub_v3">Final approval and deployment</div>
                  </div>
              </div>
      
          </div>
      
      {/* <!-- DOWNLOADS --> */}
      <div className="elforge_mosy_docs_v5">
      
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
              <span><i className="fa fa-file-pdf"></i> Payment Receipt</span>
              <a href="#">Download</a>
          </div>
      
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
              <span><i className="fa fa-file-contract"></i> Agreement</span>
              <a href="#">View</a>
          </div>
      
      </div>
      
      {/* <!-- ACTION BUTTONS --> */}
      <div className="elforge_mosy_action_box_v5">
      
          <button className="btn w-100 elforge_mosy_btn_success_v5 mb-2 text-white " data-bs-toggle="modal" data-bs-target="#approveModal">
              <i className="fa fa-check-circle"></i> Approve & Release Funds
          </button>
      
          <button className="btn w-100 elforge_mosy_btn_secondary_v4" data-bs-toggle="modal" data-bs-target="#reviewModal">
              <i className="fa fa-flag"></i> Request Review
          </button>
      
      </div>
      
      
      </div>
    );
  }