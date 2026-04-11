
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultDocumentslistStateDefaults = {

  //state management for list page
  documentslistListData : [],
  documentslistListPageCount : 1,
  documentslistLoading: true,  
  parentUseEffectKey : 'loadDocumentslistList',
  localEventSignature: 'loadDocumentslistList',
  documentslistQuerySearchStr: '',

  
  //for profile page
  documentsNode : {},
  documentslistActionStatus : 'add_documents',
  paramdocumentslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  documentslistUptoken:'',
  documentslistNode : {},
  activeScrollId : 'DocumentslistProfileTray',
  
  //dataScript
  documentslistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useDocumentslistState(overrides = {}) {
  const combinedDefaults = { ...defaultDocumentslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

