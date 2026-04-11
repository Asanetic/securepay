import { Suspense } from 'react';

import DocumentslistList from '../uiControl/DocumentslistList';

import { InteprateDocumentslistEvent } from '../dataControl/DocumentslistRequestHandler';
    
import { hiveRoutes } from '../../../appConfigs/hiveRoutes';

export async function generateMetadata({ searchParams }) {
  const mosyTitle = "Documents list "//searchParams?.mosyTitle || "Documents list";

  return {
    title: mosyTitle ? decodeURIComponent(mosyTitle) : `Documents list`,
    description: 'securepayv2 Documents list',
    
    icons: {
      icon: `${hiveRoutes.hiveBaseRoute}/logo.png`
    },    
  };
}

export default function DocumentslistMainListPage() {

return (
        <>
         <div className="main-wrapper">
           <div className="page-wrapper">
              <div className="content container-fluid p-0 m-0 ">
               <Suspense fallback={<div className="col-md-12 p-5 text-center h3">Loading...</div>}>
               
                    <DocumentslistList  
                    
                     dataIn={{ parentUseEffectKey: "loadDocumentslistList" }}
                       
                     dataOut={{
                       setChildDataOut: InteprateDocumentslistEvent
                     }}
                    />
                    
                  </Suspense>                 
              </div>
            </div>
          </div>
        </>
      );
    }