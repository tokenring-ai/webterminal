import { useContext, useEffect, useState } from 'react';
import { RegistryContext } from '../context/RegistryProvider'; // Assuming RegistryProvider exports RegistryContext
import { ConfigurationManagementService } from '@token-ring/config';
import { useStore } from 'zustand';

// Helper function to select parts of the state or the whole state.
// By default, it returns the entire store's state.
const identity = (state) => state;

export const useConfigurationStore = (selector = identity) => {
  const registry = useContext(RegistryContext);
  if (!registry) {
    throw new Error('useConfigurationStore must be used within a RegistryProvider');
  }

  const configService = registry.requireFirstServiceByType(ConfigurationManagementService);
  if (!configService) {
    // This should ideally not happen if service is correctly registered
    throw new Error('ConfigurationManagementService not found in registry');
  }

  const zustandStore = configService.getStore();

  // Use Zustand's useStore hook to subscribe to the store provided by the service
  // The selector function allows components to pick only the parts of the state they need
  const storeState = useStore(zustandStore, selector);

  return {
    // Expose methods from the service/store as needed by components
    config: storeState.config, // The entire config object from the store
    getConfiguration: zustandStore.getState().getConfiguration,
    getConfigurationValue: zustandStore.getState().getConfigurationValue,
    setConfigurationValue: zustandStore.getState().setConfigurationValue,
    updateConfiguration: zustandStore.getState().updateConfiguration,
    // Raw store access if needed, though typically you'd use selectors
    // _store: zustandStore
  };
};

export default useConfigurationStore;
