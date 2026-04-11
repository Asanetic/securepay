import { Suspense } from 'react';

import PaymentslistProfile from '../uiControl/PaymentslistProfile';

import { IntepratePaymentslistEvent } from '../dataControl/PaymentslistRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Payments list "//searchParams?.mosyTitle || "Payments list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Payments list`,
    description: 'securepayv2 Payments list',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function PaymentslistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <PaymentslistProfile 
                    dataIn={{ parentUseEffectKey: "initPaymentslistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: IntepratePaymentslistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}