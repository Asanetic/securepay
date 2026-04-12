"use client";

import { useEffect, useState } from "react";
import { Plus_Jakarta_Sans } from "next/font/google";

import Navbar from "./navbar";
import Hero from "./hero";
import PaymentCard from "./paymentcard";
import StatusCard from "./statuscard";
import FloatingBar from "./floatingbar";
import SideActions from "./sideactions";

import { mosyGetData, mosySetLSData, mosyUrlParam } from "../MosyUtils/hiveUtils";
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
    const tokenVal = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb3dfY291bnQiOjEsInJlY29yZF9pZCI6IjFGTjRaSE4iLCJ0ZWwiOiIiLCJuYW1lIjoiU3VwZXJhZG1pbiIsImVtYWlsIjoic3VwZXJhZG1pbiIsInVzZXJfcm9sZSI6Ik9ZOVRVNkMiLCJoaXZlX3NpdGVfaWQiOiJMTFJSMFpLT1hSVENPSE5fMjAyNC0xMi0yOC0wNy00NS01Ni1wbSIsImhpdmVfc2l0ZV9uYW1lIjoiU3VwZXJhZG1pbiIsInVzZXJSb2xlcyI6W3sicm93X2NvdW50IjoxLCJyb2xlX2lkIjoiTUFOQUdFX0FQUF9VU0VSUyIsImJ1bmRsZV9pZCI6Ik9ZOVRVNkMifSx7InJvd19jb3VudCI6Miwicm9sZV9pZCI6IlZJRVdfQVBQX1VTRVJTIiwiYnVuZGxlX2lkIjoiT1k5VFU2QyJ9LHsicm93X2NvdW50IjozLCJyb2xlX2lkIjoiVklFV19JTlZPSUNFUyIsImJ1bmRsZV9pZCI6Ik9ZOVRVNkMifSx7InJvd19jb3VudCI6NCwicm9sZV9pZCI6Ik1BTkFHRV9JTlZPSUNFUyIsImJ1bmRsZV9pZCI6Ik9ZOVRVNkMifSx7InJvd19jb3VudCI6NSwicm9sZV9pZCI6Ik1BTkFHRV9BU1NFVFMiLCJidW5kbGVfaWQiOiJPWTlUVTZDIn0seyJyb3dfY291bnQiOjYsInJvbGVfaWQiOiJWSUVXX0FTU0VUUyIsImJ1bmRsZV9pZCI6Ik9ZOVRVNkMifV0sImV4cCI6MTgzOTA2ODI3M30.dczcA6w_8POwqPL4l8oNeSFpINWgS95QlJMuxFx1g4U`;
    
    mosySetLSData("securepayv2_authToken", tokenVal);

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