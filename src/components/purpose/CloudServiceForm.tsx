
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';

const cloudTypes = [
  "Basic Cloud Setup",
  "Mid-Level Infra",
  "Advanced Infra",
  "Multi-Cloud Architecture + DR + Compliance"
];

const cloudProviders = ["AWS", "GCP", "Azure", "Oracle Cloud", "IBM Cloud"];
const scopeOptions = ["IAM", "S3/Storage", "Compute", "VPC/Networking", "Serverless", "Databases", "Containers"];
const regionOptions = ["us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-northeast-1", "ap-southeast-1"];
const complianceOptions = ["HIPAA", "GDPR", "SOC2", "PCI DSS", "ISO 27001", "NIST"];
const monitoringOptions = ["CloudWatch", "Datadog", "New Relic", "Prometheus", "Grafana", "Dynatrace"];

type CloudServiceFormProps = {
  onChange: (config: any) => void;
};

const CloudServiceForm = ({ onChange }: CloudServiceFormProps) => {
  const { control, watch } = useFormContext();
  const cicdRequired = watch("cloud.cicdRequired");
  
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        <FormField
          control={control}
          name="cloud.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cloud Infrastructure Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {cloudTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="cloud.accounts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Cloud Accounts</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.providers"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cloud Providers</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {cloudProviders.map((provider) => (
                  <div key={provider} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`provider-${provider}`} 
                      checked={field.value?.includes(provider)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), provider]);
                        } else {
                          field.onChange(field.value?.filter((p: string) => p !== provider));
                        }
                      }}
                    />
                    <Label htmlFor={`provider-${provider}`}>{provider}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.scope"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Infrastructure Scope</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {scopeOptions.map((scope) => (
                  <div key={scope} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`scope-${scope}`} 
                      checked={field.value?.includes(scope)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), scope]);
                        } else {
                          field.onChange(field.value?.filter((s: string) => s !== scope));
                        }
                      }}
                    />
                    <Label htmlFor={`scope-${scope}`}>{scope}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.regions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deployment Regions</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {regionOptions.map((region) => (
                  <div key={region} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`region-${region}`} 
                      checked={field.value?.includes(region)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), region]);
                        } else {
                          field.onChange(field.value?.filter((r: string) => r !== region));
                        }
                      }}
                    />
                    <Label htmlFor={`region-${region}`}>{region}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.compliance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compliance Requirements</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {complianceOptions.map((compliance) => (
                  <div key={compliance} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`compliance-${compliance}`} 
                      checked={field.value?.includes(compliance)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), compliance]);
                        } else {
                          field.onChange(field.value?.filter((c: string) => c !== compliance));
                        }
                      }}
                    />
                    <Label htmlFor={`compliance-${compliance}`}>{compliance}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.autoscaling"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Auto-scaling Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="autoscaling"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="autoscaling">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.cicdRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CI/CD Pipeline Setup Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="cicd-required"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="cicd-required">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {cicdRequired && (
          <FormField
            control={control}
            name="cloud.cicdTools"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CI/CD Tools Used</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Jenkins, GitHub Actions, GitLab CI" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={control}
          name="cloud.serverless"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Serverless Components?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="serverless"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="serverless">Yes</Label>
              </div>
              <FormDescription>e.g., Lambda, Cloud Functions</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.containerization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Containerization Used?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="containerization"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="containerization">Yes</Label>
              </div>
              <FormDescription>Docker, Kubernetes</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.disasterRecovery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disaster Recovery / Backup Strategy?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="disaster-recovery"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="disaster-recovery">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.monitoring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monitoring Tools</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {monitoringOptions.map((tool) => (
                  <div key={tool} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`monitoring-${tool}`} 
                      checked={field.value?.includes(tool)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), tool]);
                        } else {
                          field.onChange(field.value?.filter((t: string) => t !== tool));
                        }
                      }}
                    />
                    <Label htmlFor={`monitoring-${tool}`}>{tool}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="cloud.costEstimation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cloud Cost Estimation or Budget Limit</FormLabel>
              <FormControl>
                <Input placeholder="e.g., $1000/month" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CloudServiceForm;
