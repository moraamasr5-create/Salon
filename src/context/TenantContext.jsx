import React, { createContext, useContext, useState } from 'react';

const defaultTenant = {
  tenantId: 'mock-tenant-1',
  tenantName: 'صالون عز',
  plan: 'free'
};

const TenantContext = createContext(defaultTenant);

export const TenantProvider = ({ children }) => {
  const [tenant, setTenant] = useState(defaultTenant);
  return (
    <TenantContext.Provider value={{ ...tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
