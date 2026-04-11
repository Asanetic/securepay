
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultClientledgerStateDefaults = {

  //state management for list page
  clientledgerListData : [],
  clientledgerListPageCount : 1,
  clientledgerLoading: true,  
  parentUseEffectKey : 'loadClientledgerList',
  localEventSignature: 'loadClientledgerList',
  clientledgerQuerySearchStr: '',

  
  //for profile page
  clientsNode : {},
  clientledgerActionStatus : 'add_clients',
  paramclientledgerUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  clientledgerUptoken:'',
  clientledgerNode : {},
  activeScrollId : 'ClientledgerProfileTray',
  
  //dataScript
  clientledgerCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function useClientledgerState(overrides = {}) {
  const combinedDefaults = { ...defaultClientledgerStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

