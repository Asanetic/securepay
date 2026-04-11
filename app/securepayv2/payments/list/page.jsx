import { Suspense } from 'react';

import PaymentslistList from '../uiControl/PaymentslistList';

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

export default function PaymentslistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <PaymentslistList  
                    
                     dataIn={{ parentUseEffectKey: "loadPaymentslistList" }}
                       
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