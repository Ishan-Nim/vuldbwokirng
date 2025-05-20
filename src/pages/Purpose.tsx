
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Purpose = () => {
  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Purpose</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>CyberSim</CardTitle>
            <CardDescription>Dynamic pricing simulation for cybersecurity services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              CyberSim enables clients and internal sales teams to simulate dynamic pricing for cybersecurity services 
              (Web, Cloud, Network, Mobile). The tool uses Supabase Edge Functions for backend pricing logic and ChatGPT AI 
              for company intelligence profiling to better customize and justify estimates.
            </p>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center">
                <span className="mr-2">🧠</span> AI-Powered Company Profiler
              </h2>
              <p className="font-medium">Initial Step Before Pricing Simulation:</p>
              <p>
                Users are prompted to <strong>enter a company name</strong>. ChatGPT AI automatically fetches and analyzes 
                public data and store in database, delivering a snapshot including:
              </p>
              <ul className="list-none space-y-1 pl-5">
                <li>🌐 Website</li>
                <li>🏢 Head Office Location</li>
                <li>👥 Employee Count</li>
                <li>💼 Primary Businesses</li>
                <li>🗓️ Established Year</li>
                <li>💰 Capital</li>
                <li>📈 Revenue</li>
                <li>🔐 Known Data Breaches (if any)</li>
                <li>📊 Real-Time Stock Price (if listed)</li>
              </ul>
              <p>
                If the company is among <strong>Japanese listed companies (日本の上場企業)</strong>, a <strong>+12% pricing modifier</strong> is 
                applied to simulate premium SLA expectations, compliance rigor, and higher security posture needs.
              </p>
              <blockquote className="border-l-4 border-primary pl-4 italic">
                Example: Entering "Sony Corporation" will yield a detailed company profile and a slightly increased quote if publicly traded.
              </blockquote>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center">
                <span className="mr-2">🔧</span> Service Configuration UI
              </h2>
              <p>Users choose one or more services:</p>
              <ul className="list-none space-y-1 pl-5">
                <li>✅ Web Security Testing</li>
                <li>✅ Cloud Assessment</li>
                <li>✅ Network Pentest</li>
                <li>✅ Mobile App Testing</li>
              </ul>
              <p>Each selection reveals a tailored input form with context-aware fields powered by metadata from the company profile.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Input Fields Per Service</h2>
              
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">🔹</span> Web
                </h3>
                <p className="font-medium">Web Development Types:</p>
                <ul className="list-disc pl-5">
                  <li>Simple Static Website</li>
                  <li>Basic Web App</li>
                  <li>CMS-based Website</li>
                  <li>Corporate Website</li>
                  <li>E-commerce Site</li>
                  <li>Custom Web App</li>
                  <li>Enterprise Portal</li>
                </ul>
                <p className="font-medium mt-3">Existing Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Number of Pages</li>
                  <li>Login Complexity (None / Basic / MFA)</li>
                  <li>Technologies Used (React, PHP, etc.)</li>
                </ul>
                <p className="font-medium mt-3">Additional Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Hosting Provider (e.g., Netlify, Vercel, Shared Hosting, Custom Server)</li>
                  <li>CMS Integration Required? (Yes/No, if yes: WordPress, Strapi, etc.)</li>
                  <li>SEO Requirements (Yes/No)</li>
                  <li>Third-Party Integrations (e.g., Google Analytics, Stripe, Zapier)</li>
                  <li>API Requirements (Internal/External APIs, GraphQL/REST)</li>
                  <li>Multilingual Support Needed? (Yes/No)</li>
                  <li>Accessibility Compliance (WCAG Level A/AA/AAA)</li>
                  <li>Estimated Traffic Load (e.g., low/medium/high or # of daily users)</li>
                  <li>Responsive Design Needed? (Desktop / Tablet / Mobile)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">🔹</span> Cloud
                </h3>
                <p className="font-medium">Cloud Infrastructure Types:</p>
                <ul className="list-disc pl-5">
                  <li>Basic Cloud Setup</li>
                  <li>Mid-Level Infra</li>
                  <li>Advanced Infra</li>
                  <li>Multi-Cloud Architecture + DR + Compliance</li>
                </ul>
                <p className="font-medium mt-3">Existing Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Number of Cloud Accounts</li>
                  <li>Provider(s) (AWS / GCP / Azure)</li>
                  <li>Scope: IAM / S3 / VPC / etc.</li>
                </ul>
                <p className="font-medium mt-3">Additional Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Region(s) of Deployment (e.g., us-east-1, eu-west-2)</li>
                  <li>Compliance Requirements (e.g., HIPAA, GDPR, SOC2)</li>
                  <li>Auto-scaling Required? (Yes/No)</li>
                  <li>CI/CD Pipeline Setup Required? (Yes/No; if yes: Tools used)</li>
                  <li>Serverless Components? (Yes/No; e.g., Lambda, Cloud Functions)</li>
                  <li>Containerization Used? (Yes/No; Docker / Kubernetes)</li>
                  <li>Disaster Recovery / Backup Strategy in Place? (Yes/No)</li>
                  <li>Monitoring Tools (CloudWatch, Datadog, etc.)</li>
                  <li>Cloud Cost Estimation or Budget Limit?</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">🔹</span> Network
                </h3>
                <p className="font-medium">Network Configuration Types:</p>
                <ul className="list-disc pl-5">
                  <li>Simple Internal Network</li>
                  <li>Mid-Sized Corporate Network</li>
                  <li>Secure External Network</li>
                  <li>Complex Enterprise Setup</li>
                </ul>
                <p className="font-medium mt-3">Existing Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Internal / External</li>
                  <li>Number of IPs</li>
                  <li>VPN Access Required (Yes/No)</li>
                </ul>
                <p className="font-medium mt-3">Additional Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Firewall Used? (Yes/No; if yes: Type/Brand)</li>
                  <li>IDS/IPS Systems in Place? (Yes/No)</li>
                  <li>Network Segmentation Required? (Yes/No)</li>
                  <li>Bandwidth Requirements (Mbps/Gbps)</li>
                  <li>IPv6 Support Required? (Yes/No)</li>
                  <li>Network Diagram Available? (Yes/No)</li>
                  <li>DNS Services Used (Internal / External / Managed)</li>
                  <li>Remote Access Protocols Used (RDP, SSH, etc.)</li>
                  <li>Third-Party Connectivity (Partners, Vendors, etc.)</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">🔹</span> Mobile
                </h3>
                <p className="font-medium">Mobile App Development Types:</p>
                <ul className="list-disc pl-5">
                  <li>Simple App</li>
                  <li>Basic App</li>
                  <li>Mid-Level App</li>
                  <li>E-commerce / Marketplace App</li>
                  <li>Advanced App</li>
                </ul>
                <p className="font-medium mt-3">Existing Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Number of Apps</li>
                  <li>Platforms (iOS / Android)</li>
                  <li>Code Access Provided? (Yes/No)</li>
                </ul>
                <p className="font-medium mt-3">Additional Fields:</p>
                <ul className="list-disc pl-5">
                  <li>Native or Hybrid (e.g., Swift/Kotlin or Flutter/React Native)</li>
                  <li>App Store Deployment Needed? (Yes/No)</li>
                  <li>Push Notifications Required? (Yes/No; Firebase/APNs)</li>
                  <li>Backend Integration (Yes/No; API type?)</li>
                  <li>Payment Integration Needed? (Yes/No; Stripe, PayPal, etc.)</li>
                  <li>Authentication Method (Social Login / Email / SSO / None)</li>
                  <li>Offline Functionality Needed? (Yes/No)</li>
                  <li>In-App Purchases? (Yes/No)</li>
                  <li>Analytics/Crash Reporting Tools Used (Firebase, Sentry, etc.)</li>
                  <li>Security Requirements (Encryption, Jailbreak/root detection, etc.)</li>
                </ul>
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Price Calculation Logic</h2>
              <p>Pricing logic uses:</p>
              <ul className="list-disc pl-5">
                <li>Service type and complexity</li>
                <li>Service user base</li>
                <li>Company context (industry, revenue, listed/private)</li>
                <li>Risk factors (data breach history, compliance needs)</li>
                <li>AI-judged premium factors (auto-markup for listed companies: <strong>+12%</strong>)</li>
              </ul>
              
              <div>
                <h3 className="text-xl font-semibold flex items-center">
                  <span className="mr-2">🔹</span> Example Adjustment Logic:
                </h3>
                <p>If total calculated quote = ¥400万 and company is <strong>publicly traded</strong>, final quote = <strong>¥448万</strong> (+12%).</p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold">Price Calculation</h3>
                
                <h4 className="text-lg font-medium mt-4">Web Development – Price Range</h4>
                <table className="min-w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Type of Web App</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estimated Price (万円)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Simple Static Website (1-3 pages)</td>
                      <td className="border border-gray-300 px-4 py-2">50</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Basic Web App (Login, Forms)</td>
                      <td className="border border-gray-300 px-4 py-2">100</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">CMS-based Website (e.g., WordPress)</td>
                      <td className="border border-gray-300 px-4 py-2">100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Corporate Website (Custom design, SEO, Blog)</td>
                      <td className="border border-gray-300 px-4 py-2">150</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">E-commerce Site (Cart, Checkout, Payment)</td>
                      <td className="border border-gray-300 px-4 py-2">150–250</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Custom Web App (Admin Panel, APIs)</td>
                      <td className="border border-gray-300 px-4 py-2">200–450</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Enterprise Portal (Multi-role, Complex Integrations)</td>
                      <td className="border border-gray-300 px-4 py-2">450+</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4 className="text-lg font-medium mt-6">Cloud Infrastructure – Price Range</h4>
                <table className="min-w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Type of Cloud Setup</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estimated Price (万円)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Basic Cloud Setup (1 Account, IAM + S3)</td>
                      <td className="border border-gray-300 px-4 py-2">150</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Mid-Level Infra (Multi-Region, Auto-scaling, CI/CD)</td>
                      <td className="border border-gray-300 px-4 py-2">250–400</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Advanced Infra (Kubernetes, Security, Monitoring)</td>
                      <td className="border border-gray-300 px-4 py-2">400–600</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Multi-Cloud Architecture + DR + Compliance (GDPR, HIPAA)</td>
                      <td className="border border-gray-300 px-4 py-2">600–800+</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4 className="text-lg font-medium mt-6">Network Configuration – Price Range</h4>
                <table className="min-w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Type of Network Setup</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estimated Price (万円)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Simple Internal Network (≤10 IPs, No VPN)</td>
                      <td className="border border-gray-300 px-4 py-2">100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Mid-Sized Corporate Network (VPN, Segmentation)</td>
                      <td className="border border-gray-300 px-4 py-2">150–250</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Secure External Network (Firewall, IDS/IPS)</td>
                      <td className="border border-gray-300 px-4 py-2">250–400</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Complex Enterprise Setup (Hybrid, Multi-Site, HA)</td>
                      <td className="border border-gray-300 px-4 py-2">400–600+</td>
                    </tr>
                  </tbody>
                </table>
                
                <h4 className="text-lg font-medium mt-6">Mobile App Development – Price Range</h4>
                <table className="min-w-full border-collapse border border-gray-300 mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-2 text-left">Type of Mobile App</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">Estimated Price (万円)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Simple App (1–2 screens, no backend)</td>
                      <td className="border border-gray-300 px-4 py-2">100</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">Basic App (Login, API calls, 1 platform)</td>
                      <td className="border border-gray-300 px-4 py-2">150</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Mid-Level App (iOS + Android, Push, Auth)</td>
                      <td className="border border-gray-300 px-4 py-2">200–300</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">E-commerce / Marketplace App</td>
                      <td className="border border-gray-300 px-4 py-2">300–450</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-2">Advanced App (Chat, Video, Payments, Real-time)</td>
                      <td className="border border-gray-300 px-4 py-2">450–600+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Estimate Summary Output</h2>
              <p>After calculation:</p>
              <ul className="list-disc pl-5">
                <li>Service breakdown (price per category)</li>
                <li>Total estimate</li>
                <li>[Save Quote]</li>
                <li>[Download PDF]</li>
              </ul>
            </section>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Purpose;
