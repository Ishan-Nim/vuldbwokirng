
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useFormContext } from 'react-hook-form';

const networkTypes = [
  "Simple Internal Network",
  "Mid-Sized Corporate Network",
  "Secure External Network",
  "Complex Enterprise Setup"
];

const networkModes = ["Internal", "External", "Hybrid"];
const firewallTypes = ["Cisco", "Fortinet", "Palo Alto", "pfSense", "CheckPoint", "Other"];
const bandwidthOptions = ["10 Mbps", "100 Mbps", "1 Gbps", "10 Gbps", "40+ Gbps"];
const dnsOptions = ["Internal", "External", "Managed"];
const remoteAccessOptions = ["RDP", "SSH", "VPN", "VDI", "None"];

type NetworkServiceFormProps = {
  onChange: (config: any) => void;
};

const NetworkServiceForm = ({ onChange }: NetworkServiceFormProps) => {
  const { control, watch } = useFormContext();
  const hasFirewall = watch("network.firewall");
  
  return (
    <div className="space-y-4 pt-4">
      <div className="grid gap-4">
        <FormField
          control={control}
          name="network.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Configuration Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {networkTypes.map((type) => (
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
          name="network.mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {networkModes.map((mode) => (
                    <SelectItem key={mode} value={mode}>
                      {mode}
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
          name="network.ipCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number of IPs</FormLabel>
              <FormControl>
                <Input type="number" min={1} {...field} onChange={e => field.onChange(parseInt(e.target.value) || 1)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.vpnRequired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VPN Access Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="vpn-required"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="vpn-required">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.firewall"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firewall Used?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="firewall-used"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="firewall-used">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {hasFirewall && (
          <FormField
            control={control}
            name="network.firewallType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Firewall Type/Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select firewall type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {firewallTypes.map((type) => (
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
        )}

        <FormField
          control={control}
          name="network.idsIps"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IDS/IPS Systems in Place?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="ids-ips"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="ids-ips">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.segmentation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Segmentation Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="segmentation"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="segmentation">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.bandwidth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bandwidth Requirements</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select bandwidth" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {bandwidthOptions.map((option) => (
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
          name="network.ipv6Support"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IPv6 Support Required?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="ipv6-support"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="ipv6-support">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.networkDiagram"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Network Diagram Available?</FormLabel>
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox 
                  id="network-diagram"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <Label htmlFor="network-diagram">Yes</Label>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.dnsServices"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DNS Services Used</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select DNS services" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dnsOptions.map((option) => (
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
          name="network.remoteAccess"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remote Access Protocols Used</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {remoteAccessOptions.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`remote-access-${option}`} 
                      checked={field.value?.includes(option)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...(field.value || []), option]);
                        } else {
                          field.onChange(field.value?.filter((o: string) => o !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`remote-access-${option}`}>{option}</Label>
                  </div>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="network.thirdPartyConnectivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Third-Party Connectivity</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Partners, Vendors, Clients" {...field} />
              </FormControl>
              <FormDescription>List partners, vendors, or clients with network access</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default NetworkServiceForm;
