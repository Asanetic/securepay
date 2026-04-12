export default function Navbar() {
    return (
      
      <nav className="elforge_mosy_nav_v1">
        <div className="d-flex align-items-center justify-content-between">
          <div className="elforge_mosy_nav_brand_v1">
            <i className="fa fa-shield medium_icon mr-2 "></i> 
            <span className="h2 pl-2">SecurePay</span>
          </div>
          <div className="elforge_mosy_nav_status_v1">
            <i className="fa fa-lock"></i> Secure Session
          </div>
        </div>
      </nav>
      
    );
  }