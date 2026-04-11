import { Plus_Jakarta_Sans } from "next/font/google";

const securePayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

import Navbar from "./navbar";
import Hero from "./hero";
import PaymentCard from "./paymentcard";
import StatusCard from "./statuscard";
import FloatingBar from "./floatingbar";
import SideActions from "./sideactions";


export default function SecurePayPage() {
  return (
    <div className={securePayFont.className}>

      <Navbar />

      <Hero />

      <div className="py-4">
        <div className="row justify-content-center m-0 p-0 col-md-12">
          <div className="col-md-7 m-0 p-0 border border-light shadow-sm">

            <PaymentCard />
            <StatusCard />

          </div>
        </div>
      </div>

      <FloatingBar />
      <SideActions />

    </div>
  );
}