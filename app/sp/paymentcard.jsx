export default function PaymentCard() {
    return (
      // <!-- ===== PAYMENT CARD ===== -->
      <div className="card elforge_mosy_card_v2 p-4 mb-4">
      
      <div className="mb-3 text-left">
          <h3 className="elforge_mosy_title_v2 py-3">Asanetic webdesign sent you a transparency payment request</h3>
          <div className="elforge_mosy_sub_v2">Your progress so far</div>
      </div>
          {/* <!-- PROGRESS --> */}
      <div className="elforge_mosy_timeline_v3 mb-3">
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_done_v3">✓</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Registration</div>
              </div>
          </div>
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_done_v3">✓</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Invoice Sent</div>
              </div>
          </div>
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_done_v3">✓</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Agreement</div>
              </div>
          </div>
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_active_v3">●</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Payment</div>
                  <div className="elforge_mosy_step_sub_v3">You are here</div>
              </div>
          </div>
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Funds Locked</div>
                  <div className="elforge_mosy_step_sub_v3">Next step</div>
                                      
              </div>
          </div>
      
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Project Start</div>
                  <div className="elforge_mosy_step_sub_v3">Next step</div>
                                      
              </div>
          </div>
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Project review</div>
                  <div className="elforge_mosy_step_sub_v3">Next step</div>
                                      
              </div>
          </div> 
          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">Approval and Launch</div>
                  <div className="elforge_mosy_step_sub_v3">Next step</div>
                                      
              </div>
          </div>

          <div className="elforge_mosy_step_item_v3">
              <div className="elforge_mosy_step_icon_v3 elforge_mosy_step_pending_v3">•</div>
              <div className="elforge_mosy_step_text_v3">
                  <div className="elforge_mosy_step_title_v3">You approve and funds released to recepient</div>
                  <div className="elforge_mosy_step_sub_v3">Final step</div>
                                      
              </div>
          </div>


      </div>
      
          <div className="text-center mb-3">
              <h3 className="elforge_mosy_title_v2">Payment Request</h3>
              <div className="elforge_mosy_sub_v2">
                  Website Design – Daniel Hardware
              </div>
          </div>
          {/* <!-- INFO --> */}
      <div className="elforge_mosy_amount_v4">
          <div className="elforge_mosy_amount_label_v4">Amount to Pay</div>
          <div className="elforge_mosy_amount_value_v4">KES 15,000</div>
      </div>
      
          {/* <!-- TRUST --> */}
      <div className="elforge_mosy_info_v4 mb-3">
      
      <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
      <span><i className="fa fa-building mr-1"></i> Provider</span>
              <strong>Asanetic Digital</strong>
          </div>
      
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
              <span><i className="fa fa-shield mr-1"></i> Process</span>
              <strong>SecurePay</strong>
          </div>
      
          <div className="elforge_mosy_doc_item_v5 py-2 border-bottom">
              <span><i className="fa fa-file mr-1"></i> Project</span>
              <strong>Website Design</strong>
          </div>
      
      </div>
      
          {/* <!-- FORM --> */}
      
      <div className="elforge_mosy_input_group_v5">
          <label className="elforge_mosy_label_v5">
              <i className="fa fa-phone"></i> Phone Number
          </label>
          <div className="elforge_mosy_label_sub_v5">
              Enter the number registered with M-Pesa
          </div>
          <input 
              className="elforge_mosy_input_v5" 
              placeholder="e.g. 0712 345 678"
          />
      </div>
      
      <div className="elforge_mosy_input_group_v5">
          <label className="elforge_mosy_label_v5">
              <i className="fa fa-user"></i> Full Name
          </label>
          <div className="elforge_mosy_label_sub_v5">
              Used for payment verification
          </div>
          <input 
              className="elforge_mosy_input_v5" 
              placeholder="e.g. John Mwangi"
          />
      </div>
      
        <div className="text-center mb-2" >
          <i className="fa fa-shield"></i> After payment we will send you a receipt as proof of transaction
      </div>                              
      <button className="btn w-100 elforge_mosy_btn_primary_v4  text-white ">
          <i className="fa fa-mobile"></i> Pay via M-Pesa
      </button>
      
      <button className="btn w-100 elforge_mosy_btn_secondary_v4 d-none">
          <i className="fa fa-flag"></i> Request Review
      </button>
      
      </div>
    );
  }