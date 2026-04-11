import { Suspense } from 'react';

import ClientledgerProfile from '../uiControl/ClientledgerProfile';

import { InteprateClientledgerEvent } from '../dataControl/ClientledgerRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Client ledger "//searchParams?.mosyTitle || "Client ledger";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Client ledger`,
    description: 'securepayv2 Client ledger',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function ClientledgerMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ClientledgerProfile 
                    dataIn={{ parentUseEffectKey: "initClientledgerProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateClientledgerEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}