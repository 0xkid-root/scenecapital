'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileSignature, 
  Check, 
  X, 
  ChevronRight, 
  Calendar, 
  Globe, 
  DollarSign, 
  Shield, 
  AlertTriangle,
  Download,
  Info,
  Wallet
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Sample license types
const licenseTypes = [
  {
    id: 'non-exclusive',
    name: 'Non-Exclusive License',
    description: 'Limited usage rights for specific platforms or regions. Multiple licensees can hold similar rights.',
    price: 5000,
    duration: '1 year',
    features: [
      { feature: 'Digital Distribution Rights', included: true },
      { feature: 'Streaming Platform Rights', included: true },
      { feature: 'Theatrical Distribution Rights', included: false },
      { feature: 'Merchandise Rights', included: false },
      { feature: 'Adaptation Rights', included: false },
      { feature: 'Global Rights', included: false },
      { feature: 'Exclusive Rights', included: false },
    ],
    royaltyRate: '5%',
    territories: ['North America', 'Europe'],
    popular: false
  },
  {
    id: 'premium',
    name: 'Premium License',
    description: 'Comprehensive rights package with broader distribution capabilities and merchandise options.',
    price: 25000,
    duration: '2 years',
    features: [
      { feature: 'Digital Distribution Rights', included: true },
      { feature: 'Streaming Platform Rights', included: true },
      { feature: 'Theatrical Distribution Rights', included: true },
      { feature: 'Merchandise Rights', included: true },
      { feature: 'Adaptation Rights', included: false },
      { feature: 'Global Rights', included: false },
      { feature: 'Exclusive Rights', included: false },
    ],
    royaltyRate: '8%',
    territories: ['Global'],
    popular: true
  },
  {
    id: 'exclusive',
    name: 'Exclusive License',
    description: 'Full commercial rights for all platforms worldwide with exclusive control over the IP.',
    price: 75000,
    duration: '3 years',
    features: [
      { feature: 'Digital Distribution Rights', included: true },
      { feature: 'Streaming Platform Rights', included: true },
      { feature: 'Theatrical Distribution Rights', included: true },
      { feature: 'Merchandise Rights', included: true },
      { feature: 'Adaptation Rights', included: true },
      { feature: 'Global Rights', included: true },
      { feature: 'Exclusive Rights', included: true },
    ],
    royaltyRate: '12%',
    territories: ['Global'],
    popular: false
  }
];

export default function LicensePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [selectedLicenseType, setSelectedLicenseType] = useState('premium');
  const [territory, setTerritory] = useState('global');
  const [duration, setDuration] = useState('2-years');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  
  // Get the selected license details
  const selectedLicense = licenseTypes.find(license => license.id === selectedLicenseType) || licenseTypes[1];
  
  // Calculate price based on selections
  const basePrice = selectedLicense.price;
  const territoryMultiplier = territory === 'global' ? 1 : 0.7;
  const durationMultiplier = 
    duration === '1-year' ? 0.7 : 
    duration === '2-years' ? 1 : 
    duration === '3-years' ? 1.3 : 1;
  
  const calculatedPrice = basePrice * territoryMultiplier * durationMultiplier;
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden" role="main" aria-labelledby="page-title">
      {/* Background gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-8"
      >
        {/* Breadcrumb */}
        <motion.div 
          variants={item} 
          className="flex items-center text-sm text-muted-foreground"
          role="navigation"
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center">
            <li>
              <a href="/projects" className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">Projects</a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4 mx-2" />
            </li>
            <li>
              <a href={`/projects/${id}`} className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded-sm">Cosmic Odyssey</a>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="h-4 w-4 mx-2" />
            </li>
            <li aria-current="page">
              <span className="text-foreground font-medium">License</span>
            </li>
          </ol>
        </motion.div>
        
        {/* Page Header */}
        <motion.div variants={item} className="space-y-2">
          <div className="flex items-center gap-2">
            <FileSignature className="h-6 w-6 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold" id="page-title">IP Licensing Agreement</h1>
          </div>
          <p className="text-muted-foreground">
            License the intellectual property rights for "Cosmic Odyssey" for commercial use.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* License Options */}
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Select License Type</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Choose the licensing option that best suits your business needs
                </p>
              </div>
              
              <div className="p-6">
                <RadioGroup 
                  defaultValue={selectedLicenseType} 
                  onValueChange={setSelectedLicenseType}
                  className="space-y-6"
                >
                  {licenseTypes.map((license) => (
                    <div 
                      key={license.id} 
                      className={`relative rounded-lg border p-4 ${selectedLicenseType === license.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}
                      role="group"
                      aria-labelledby={`license-name-${license.id}`}
                    >
                      {license.popular && (
                        <Badge className="absolute -top-2 -right-2 bg-primary" aria-label="Popular license option">Popular</Badge>
                      )}
                      <div className="flex items-start">
                        <RadioGroupItem 
                          value={license.id} 
                          id={license.id} 
                          className="mt-1" 
                          aria-describedby={`license-desc-${license.id}`}
                        />
                        <div className="ml-3 space-y-2 w-full">
                          <div className="flex items-center justify-between">
                            <Label 
                              htmlFor={license.id} 
                              className="text-base font-medium cursor-pointer"
                              id={`license-name-${license.id}`}
                            >
                              {license.name}
                            </Label>
                            <div className="text-right" aria-label={`Price: $${license.price.toLocaleString()} for ${license.duration}`}>
                              <span className="text-lg font-bold">${license.price.toLocaleString()}</span>
                              <span className="text-muted-foreground text-sm ml-1">/ {license.duration}</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground" id={`license-desc-${license.id}`}>{license.description}</p>
                          <div className="grid grid-cols-2 gap-2 mt-3" role="list" aria-label="License features">
                            {license.features.map((feature, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm" role="listitem">
                                {feature.included ? (
                                  <Check className="h-4 w-4 text-green-500" aria-hidden="true" />
                                ) : (
                                  <X className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                                )}
                                <span 
                                  className={feature.included ? '' : 'text-muted-foreground'}
                                  aria-label={`${feature.feature}: ${feature.included ? 'Included' : 'Not included'}`}
                                >
                                  {feature.feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </Card>
            
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">License Details</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Customize your license terms
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="territory">Territory</Label>
                    <Select value={territory} onValueChange={setTerritory}>
                      <SelectTrigger id="territory">
                        <SelectValue placeholder="Select territory" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Geographic regions where the license applies
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={duration} onValueChange={setDuration}>
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-year">1 Year</SelectItem>
                        <SelectItem value="2-years">2 Years</SelectItem>
                        <SelectItem value="3-years">3 Years</SelectItem>
                        <SelectItem value="5-years">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Length of time the license will be valid
                    </p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-3">License Terms</h3>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Royalty Structure</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <p className="text-sm">
                            Licensee agrees to pay a royalty rate of <span className="font-medium">{selectedLicense.royaltyRate}</span> on all revenue generated from the licensed IP.
                          </p>
                          <div className="grid grid-cols-2 gap-4 text-sm mt-3">
                            <div>
                              <p className="font-medium">Streaming Revenue:</p>
                              <p className="text-muted-foreground">{selectedLicense.royaltyRate} of net revenue</p>
                            </div>
                            <div>
                              <p className="font-medium">Merchandise Sales:</p>
                              <p className="text-muted-foreground">{parseInt(selectedLicense.royaltyRate) + 2}% of net revenue</p>
                            </div>
                            <div>
                              <p className="font-medium">Payment Schedule:</p>
                              <p className="text-muted-foreground">Quarterly</p>
                            </div>
                            <div>
                              <p className="font-medium">Reporting Requirements:</p>
                              <p className="text-muted-foreground">Monthly sales reports</p>
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Usage Rights</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            This license grants the following rights to the licensee:
                          </p>
                          <ul className="list-disc pl-5 space-y-1">
                            {selectedLicense.features
                              .filter(f => f.included)
                              .map((feature, index) => (
                                <li key={index}>{feature.feature}</li>
                              ))
                            }
                          </ul>
                          <p className="mt-2">
                            All other rights not explicitly granted remain with the IP owner.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Term and Termination</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <p>
                            This license agreement commences on the effective date and continues for the duration selected, unless terminated earlier in accordance with the terms of this agreement.
                          </p>
                          <p className="mt-2">
                            Either party may terminate this agreement for material breach with 30 days written notice if the breach remains uncured.
                          </p>
                          <p className="mt-2">
                            Upon termination, all rights granted revert to the IP owner, and the licensee must cease all use of the licensed IP.
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </Card>
            
            <Card>
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">Legal Agreement</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review and accept the terms of the licensing agreement
                </p>
              </div>
              
              <div className="p-6">
                <div className="rounded-lg border bg-muted/50 p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Important Notice</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        This is a legally binding agreement. We recommend consulting with your legal counsel before proceeding. By accepting these terms, you agree to be bound by all conditions outlined in the full license agreement.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 mb-6">
                  <Checkbox 
                    id="terms" 
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    aria-required="true"
                    aria-describedby="terms-description"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <Label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the terms and conditions
                    </Label>
                    <p className="text-sm text-muted-foreground" id="terms-description">
                      By checking this box, I confirm that I have read, understood, and agree to the full license agreement.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    aria-label="Download full license agreement"
                  >
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Download Full Agreement
                  </Button>
                  <Button 
                    disabled={!agreeToTerms} 
                    className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                    aria-label="Request license"
                    aria-disabled={!agreeToTerms}
                  >
                    <FileSignature className="h-4 w-4 mr-2" aria-hidden="true" />
                    Request License
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* License Summary */}
          <motion.div variants={item} className="lg:col-span-1 space-y-6">
            <Card className="sticky top-6">
              <div className="p-6 border-b bg-gradient-to-br from-primary/5 to-transparent">
                <h2 className="text-xl font-semibold">License Summary</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your license selection
                </p>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Project Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img 
                          src="/projects/cosmic-odyssey-1.jpg" 
                          alt="Cosmic Odyssey" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">Cosmic Odyssey</p>
                        <p className="text-sm text-muted-foreground">Science Fiction Film</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Release: 2025</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span>Global Rights</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">License Details</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">License Type</span>
                      <span className="font-medium">{selectedLicense.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Territory</span>
                      <span className="font-medium capitalize">{territory.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium capitalize">{duration.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Royalty Rate</span>
                      <span className="font-medium">{selectedLicense.royaltyRate}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Payment Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base License Fee</span>
                      <span>${selectedLicense.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Territory Adjustment</span>
                      <span>{territoryMultiplier < 1 ? '-' : ''}${Math.abs(selectedLicense.price - (selectedLicense.price * territoryMultiplier)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration Adjustment</span>
                      <span>{durationMultiplier < 1 ? '-' : '+'}${Math.abs(selectedLicense.price - (selectedLicense.price * durationMultiplier)).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                      <span>Total License Fee</span>
                      <span>${Math.round(calculatedPrice).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="rounded-lg bg-muted/50 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-primary mt-0.5" />
                      <div className="text-xs">
                        <p>This license is subject to approval by the IP owner. You will be notified within 3 business days of your request.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  disabled={!agreeToTerms} 
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Complete Purchase
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
