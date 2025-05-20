
import React from 'react';
import WebServiceForm from './WebServiceForm';
import CloudServiceForm from './CloudServiceForm';
import NetworkServiceForm from './NetworkServiceForm';
import MobileServiceForm from './MobileServiceForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceType, WebServiceConfig, CloudServiceConfig, NetworkServiceConfig, MobileServiceConfig } from '@/types/purpose';

type ServiceFormSelectorProps = {
  selectedService: ServiceType;
  onChange: (config: WebServiceConfig | CloudServiceConfig | NetworkServiceConfig | MobileServiceConfig) => void;
};

export const ServiceFormSelector = ({ selectedService, onChange }: ServiceFormSelectorProps) => {
  switch (selectedService) {
    case 'web':
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Web Security Testing Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <WebServiceForm onChange={(config) => onChange(config as WebServiceConfig)} />
          </CardContent>
        </Card>
      );
    case 'cloud':
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Cloud Assessment Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <CloudServiceForm onChange={(config) => onChange(config as CloudServiceConfig)} />
          </CardContent>
        </Card>
      );
    case 'network':
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Network Pentest Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <NetworkServiceForm onChange={(config) => onChange(config as NetworkServiceConfig)} />
          </CardContent>
        </Card>
      );
    case 'mobile':
      return (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">Mobile App Testing Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <MobileServiceForm onChange={(config) => onChange(config as MobileServiceConfig)} />
          </CardContent>
        </Card>
      );
    default:
      return null;
  }
};

export default ServiceFormSelector;
