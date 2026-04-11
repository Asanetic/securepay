
import {mosyStateManager} from '../../../MosyUtils/hiveUtils';

const defaultPaymentslistStateDefaults = {

  //state management for list page
  paymentslistListData : [],
  paymentslistListPageCount : 1,
  paymentslistLoading: true,  
  parentUseEffectKey : 'loadPaymentslistList',
  localEventSignature: 'loadPaymentslistList',
  paymentslistQuerySearchStr: '',

  
  //for profile page
  paymentsNode : {},
  paymentslistActionStatus : 'add_payments',
  parampaymentslistUptoken  : '',
  snackMessage : '',
  snackOnDone : ()=>()=>{},
  paymentslistUptoken:'',
  paymentslistNode : {},
  activeScrollId : 'PaymentslistProfileTray',
  
  //dataScript
  paymentslistCustomProfileQuery : '',
  
  
  // ... other base defaults
};

export function usePaymentslistState(overrides = {}) {
  const combinedDefaults = { ...defaultPaymentslistStateDefaults, ...overrides };
  return mosyStateManager(combinedDefaults);
}

