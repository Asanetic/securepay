import { Suspense } from 'react';

import ProjectstepslistProfile from '../uiControl/ProjectstepslistProfile';

import { InteprateProjectstepslistEvent } from '../dataControl/ProjectstepslistRequestHandler';

import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Project steps list "//searchParams?.mosyTitle || "Project steps list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Project steps list`,
    description: 'securepayv2 Project steps list',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}    
                      

export default function ProjectstepslistMainProfilePage() {

   return (
     <>
       <div className="main-wrapper">
          <div className="page-wrapper">
             <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
                 <ProjectstepslistProfile 
                    dataIn={{ parentUseEffectKey: "initProjectstepslistProfile" }} 
                                           
                    dataOut={{
                       setChildDataOut: InteprateProjectstepslistEvent
                    }}   
                    
                 />
               </Suspense>
             </div>
           </div>
         </div>
       </>
     );
}