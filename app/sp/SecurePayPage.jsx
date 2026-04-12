"use client";

import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import Navbar from "./navbar";
import Hero from "./hero";
import PaymentCard from "./paymentcard";
import StatusCard from "./statuscard";
import FloatingBar from "./floatingbar";
import SideActions from "./sideactions";

import { mosyGetData, mosyUrlParam } from "../MosyUtils/hiveUtils";
import { getApiRoutes } from "../securepayv2/AppRoutes/apiRoutesHandler";
import DynamicModalProvider from "../components/DynamicModalProvider";

const securePayFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const apiRoutes = getApiRoutes();

export default function SecurePayPage() {
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(function () {
    async function fetchData() {
      try {
        const projectData = await mosyGetData({
          endpoint: apiRoutes.clientportal.base,
          params: { spid: mosyUrlParam("spid") },
        });

        setPortalData(projectData?.data || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const project = portalData?.project || {};
  const payments = portalData?.payments || [];

  const totalPaid = payments.reduce(function (sum, p) {
    return sum + Number(p?.amount || 0);
  }, 0);

  const projectAmount = Number(project?.amount || 0);
  const isFullyPaid = totalPaid >= projectAmount;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <i className="fa fa-spinner fa-spin mr-2" style={{ fontSize: "40px" }}></i>
        One sec something awesome is loading ...
      </div>
    );
  }

  return (
    <div className={securePayFont.className}>
      <Navbar />
      <Hero />

      <div className="py-4">
        <div className="row justify-content-center m-0 p-0 col-md-12">
          <div className="col-md-7 m-0 p-0 border border-light shadow-sm">
            {!isFullyPaid && <PaymentCard data={portalData} />}
            <StatusCard data={portalData} />
          </div>
        </div>
      </div>

      <FloatingBar {...project} isFullyPaid={isFullyPaid} />
      <SideActions />
      <DynamicModalProvider />
    </div>
  );
}