
export type ServiceType = 'web' | 'cloud' | 'network' | 'mobile';

export type CompanyProfile = {
  name: string;
  website?: string;
  headOffice?: string;
  employeeCount?: number;
  mainBusiness?: string[];
  established?: string;
  capital?: string;
  revenue?: string;
  dataBreaches?: string[];
  isListed?: boolean;
  stockPrice?: string;
  country?: string;
  isJapaneseListed?: boolean;
};

export type WebServiceConfig = {
  type: string;
  pages: number;
  loginComplexity: string;
  technologies: string[];
  hostingProvider: string;
  cmsIntegration: boolean;
  cmsType?: string;
  seoRequirements: boolean;
  thirdPartyIntegrations: string;
  apiRequirements: string;
  multilingualSupport: boolean;
  accessibilityCompliance: string;
  estimatedTraffic: string;
  responsiveDesign: string;
  price: number;
};

export type CloudServiceConfig = {
  type: string;
  accounts: number;
  providers: string[];
  scope: string[];
  regions: string[];
  compliance: string[];
  autoscaling: boolean;
  cicdRequired: boolean;
  cicdTools?: string;
  serverless: boolean;
  containerization: boolean;
  disasterRecovery: boolean;
  monitoring: string[];
  costEstimation: string;
  price: number;
};

export type NetworkServiceConfig = {
  type: string;
  mode: string;
  ipCount: number;
  vpnRequired: boolean;
  firewall: boolean;
  firewallType?: string;
  idsIps: boolean;
  segmentation: boolean;
  bandwidth: string;
  ipv6Support: boolean;
  networkDiagram: boolean;
  dnsServices: string;
  remoteAccess: string[];
  thirdPartyConnectivity: string;
  price: number;
};

export type MobileServiceConfig = {
  type: string;
  count: number;
  platforms: string;
  codeAccess: boolean;
  developmentType: string;
  appStoreDeployment: boolean;
  pushNotifications: boolean;
  backendIntegration: boolean;
  apiType: string;
  paymentIntegration: boolean;
  authentication: string;
  offlineFunctionality: boolean;
  inAppPurchases: boolean;
  analytics: string;
  securityRequirements: string;
  price: number;
};

export type ServiceConfig = {
  web?: WebServiceConfig;
  cloud?: CloudServiceConfig;
  network?: NetworkServiceConfig;
  mobile?: MobileServiceConfig;
};

export type Quote = {
  companyProfile: CompanyProfile;
  services: ServiceConfig;
  totalPrice: number;
  createdAt: Date;
};
