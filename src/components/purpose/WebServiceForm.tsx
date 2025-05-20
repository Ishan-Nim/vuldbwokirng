
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';

const webTypes = [
  "Simple Static Website",
  "Basic Web App",
  "CMS-based Website",
  "Corporate Website",
  "E-commerce Site", 
  "Custom Web App",
  "Enterprise Portal"
];

const loginComplexities = ["None", "Basic", "MFA"];
const techOptions = ["React", "Angular", "Vue", "PHP", "Ruby", "Python", "Java", ".NET"];
const hostingOptions = ["Netlify", "Vercel", "AWS", "GCP", "Azure", "Shared Hosting", "Custom Server"];
const cmsOptions = ["WordPress", "Strapi", "Drupal", "Contentful", "None"];
const accessibilityOptions = ["Level A", "Level AA", "Level AAA"];
const trafficOptions = ["Low", "Medium", "High"];
const responsiveOptions = ["Desktop Only", "Desktop + Tablet", "Desktop + Tablet + Mobile"];
const apiOptions = ["None", "REST", "GraphQL", "Both"];

type WebServiceFormProps = {
  onChange: (config: any) => void;
};

const WebServiceForm = ({ onChange }: WebServiceFormProps) => {
  const { control, watch } = useFormContext();
  const cmsRequired = watch("web.cmsIntegration");
  
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        <FormField
          control={control}
          name="web.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Web Development Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {webTypes.map((type) => (
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
          name="web.pages"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of Pages</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="web.loginComplexity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Login Complexity</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select complexity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loginComplexities.map((complexity) => (
                    <SelectItem key={complexity} value={complexity}>
                      {complexity}
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
          name="web.technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies Used</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {techOptions.map((tech) => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`tech-${tech}`} 
                      checked={field.value?.includes(tech)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), tech]);
                        } else {
                          field.onChange(field.value?.filter((t: string) => t !== tech));
                        }
                      }}
                    />
                    <Label htmlFor={`tech-${tech}`}>{tech}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="web.hostingProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hosting Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select hosting" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {hostingOptions.map((option) => (
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
          name="web.cmsIntegration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CMS Integration Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="cms-integration"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="cms-integration">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {cmsRequired && (
          <FormField
            control={control}
            name="web.cmsType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CMS Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CMS" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {cmsOptions.map((option) => (
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
        )}

        <FormField
          control={control}
          name="web.seoRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SEO Requirements?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="seo-requirements"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="seo-requirements">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="web.thirdPartyIntegrations"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Third-Party Integrations</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Google Analytics, Stripe, Zapier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="web.apiRequirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>API Requirements</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select API requirement" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {apiOptions.map((option) => (
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
          name="web.multilingualSupport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Multilingual Support Needed?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="multilingual-support"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="multilingual-support">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="web.accessibilityCompliance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Accessibility Compliance</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select compliance level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accessibilityOptions.map((option) => (
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
          name="web.estimatedTraffic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Traffic Load</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select traffic level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {trafficOptions.map((option) => (
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
          name="web.responsiveDesign"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsive Design Needed?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select responsive options" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {responsiveOptions.map((option) => (
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
      </div>
    </div>
  );
};

export default WebServiceForm;
