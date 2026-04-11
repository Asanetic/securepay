
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultProjectstepslistStateDefaults = {

  //state management for list page
  projectstepslistListData : [],
  projectstepslistListPageCount : 1,
  projectstepslistLoading: true,  
  parentUseEffectKey : 'loadProjectstepslistList',
  localEventSignature: 'loadProjectstepslistList',
  projectstepslistQuerySearchStr: '',

  
  //for profile page
  project_stepsNode : {},
  projectstepslistActionStatus : 'add_project_steps',
  paramprojectstepslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  projectstepslistUptoken:'',
  projectstepslistNode : {},
  activeScrollId : 'ProjectstepslistProfileTray',
  
  //dataScript
  projectstepslistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useProjectstepslistState(overrides = {}) {
  const combinedDefaults = { ...defaultProjectstepslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

