import { Suspense } from 'react';

import ProjectslistList from '../uiControl/ProjectslistList';

import { InteprateProjectslistEvent } from '../dataControl/ProjectslistRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Projects list "//searchParams?.mosyTitle || "Projects list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Projects list`,
    description: 'securepayv2 Projects list',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function ProjectslistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <ProjectslistList  
                    
                     dataIn={{ parentUseEffectKey: "loadProjectslistList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateProjectslistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }