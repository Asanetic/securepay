
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultProjectslistStateDefaults = {

  //state management for list page
  projectslistListData : [],
  projectslistListPageCount : 1,
  projectslistLoading: true,  
  parentUseEffectKey : 'loadProjectslistList',
  localEventSignature: 'loadProjectslistList',
  projectslistQuerySearchStr: '',

  
  //for profile page
  projectsNode : {},
  projectslistActionStatus : 'add_projects',
  paramprojectslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  projectslistUptoken:'',
  projectslistNode : {},
  activeScrollId : 'ProjectslistProfileTray',
  
  //dataScript
  projectslistCustomProfileQuery : '',
  projectstepslistCustomProfileQuery : ``,
documentslistCustomProfileQuery : ``,

  
  // ... other base defaults
};

export function useProjectslistState(overrides = {}) {
  const combinedDefaults = { ...defaultProjectslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

