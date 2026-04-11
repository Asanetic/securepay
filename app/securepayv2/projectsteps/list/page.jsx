import { Suspense } from 'react';

import ProjectstepslistList from '../uiControl/ProjectstepslistList';

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

export default function ProjectstepslistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ProjectstepslistList  
                    
                     dataIn={{ parentUseEffectKey: "loadProjectstepslistList" }}
                       
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