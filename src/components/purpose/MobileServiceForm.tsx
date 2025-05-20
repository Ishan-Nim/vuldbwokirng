
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';

const mobileTypes = [
  "Simple App",
  "Basic App",
  "Mid-Level App",
  "E-commerce / Marketplace App",
  "Advanced App"
];

const platformOptions = ["iOS", "Android", "Both"];
const developmentOptions = ["Native", "React Native", "Flutter", "Xamarin", "Ionic"];
const authenticationOptions = ["None", "Email/Password", "Social Login", "SSO", "Biometric"];
const analyticsOptions = ["None", "Firebase Analytics", "Mixpanel", "Amplitude", "Sentry", "Crashlytics"];

type MobileServiceFormProps = {
  onChange: (config: any) => void;
};

const MobileServiceForm = ({ onChange }: MobileServiceFormProps) => {
  const { control, watch } = useFormContext();
  
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        <FormField
          control={control}
          name="mobile.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mobile App Development Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {mobileTypes.map((type) => (
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
          name="mobile.count"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Apps</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.platforms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platforms</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platforms" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platformOptions.map((platform) => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
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
          name="mobile.codeAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code Access Provided?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="code-access"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="code-access">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.developmentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Native or Hybrid</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select development type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {developmentOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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
          name="mobile.appStoreDeployment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>App Store Deployment Needed?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="app-store-deployment"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="app-store-deployment">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.pushNotifications"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Push Notifications Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="push-notifications"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="push-notifications">Yes</Label>
              </div>
              <FormDescription>Firebase/APNs</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.backendIntegration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Backend Integration</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="backend-integration"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="backend-integration">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.apiType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Type</FormLabel>
              <FormControl>
                <Input placeholder="e.g., REST, GraphQL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.paymentIntegration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Integration Needed?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="payment-integration"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="payment-integration">Yes</Label>
              </div>
              <FormDescription>Stripe, PayPal, etc.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.authentication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Authentication Method</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select authentication method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {authenticationOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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
          name="mobile.offlineFunctionality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offline Functionality Needed?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="offline-functionality"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="offline-functionality">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.inAppPurchases"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In-App Purchases?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="in-app-purchases"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="in-app-purchases">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="mobile.analytics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Analytics/Crash Reporting Tools</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analytics tools" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {analyticsOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
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
          name="mobile.securityRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Security Requirements</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Encryption, Jailbreak detection" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default MobileServiceForm;
