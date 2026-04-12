import { promptProjectPayment } from "./utils/promptStk";

export default function FloatingBar(props = {}) {
  const { isFullyPaid, ...project } = props;
  
    return (
      <div className="elforge_mosy_floatbar_v1">
        <div className="elforge_mosy_floatbar_inner_v1">
  
        {!isFullyPaid && (
  <button 
    onClick={() => promptProjectPayment(project)}
    className="elforge_mosy_float_btn_v1 elforge_mosy_float_primary_v1">
    Pay Now
  </button>
)}
{/*   
          <button className="elforge_mosy_float_btn_v1 elforge_mosy_float_secondary_v1">
            Status : {isFullyPaid ? "Fully Paid" : "Pending paid"}
          </button> */}
  
        </div>
      </div>
    );
  }