import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useEffect } from "react";
import type { BusinessInfo } from "@/types";

interface BusinessFormProps {
  businessInfo: BusinessInfo;
  onBusinessInfoChange: (info: BusinessInfo) => void;
}

export const BusinessForm = ({ businessInfo, onBusinessInfoChange }: BusinessFormProps) => {
  // Load saved business info on component mount
  useEffect(() => {
    const savedBusinessInfo = localStorage.getItem('invoiceGen_businessInfo');
    if (savedBusinessInfo && !businessInfo.name) {
      try {
        const parsed = JSON.parse(savedBusinessInfo);
        onBusinessInfoChange(parsed);
      } catch (error) {
        console.error('Error loading saved business info:', error);
      }
    }
  }, []);

  const handleInputChange = (field: keyof BusinessInfo, value: string) => {
    const updatedInfo = {
      ...businessInfo,
      [field]: value,
    };
    onBusinessInfoChange(updatedInfo);
    
    // Save to localStorage whenever business info changes
    localStorage.setItem('invoiceGen_businessInfo', JSON.stringify(updatedInfo));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        handleInputChange('logo', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    handleInputChange('logo', '');
  };

  return (
    <div className="space-y-4">
      {/* Logo Upload Section */}
      <div className="space-y-2">
        <Label>Company Logo</Label>
        <div className="flex items-center gap-4">
          {businessInfo.logo ? (
            <div className="relative">
              <img 
                src={businessInfo.logo} 
                alt="Company Logo" 
                className="h-16 w-16 object-contain border rounded-lg"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                onClick={removeLogo}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="h-16 w-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="border-border focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Upload PNG, JPG, or SVG. Max size 2MB.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            placeholder="Your Business Name"
            value={businessInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessEmail">Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="business@example.com"
            value={businessInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessAddress">Address *</Label>
        <Input
          id="businessAddress"
          placeholder="123 Business Street"
          value={businessInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="border-border focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessCity">City *</Label>
          <Input
            id="businessCity"
            placeholder="New York"
            value={businessInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessPostalCode">Postal Code *</Label>
          <Input
            id="businessPostalCode"
            placeholder="10001"
            value={businessInfo.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="businessPhone">Phone *</Label>
          <Input
            id="businessPhone"
            placeholder="+1 (555) 123-4567"
            value={businessInfo.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="businessWebsite">Website</Label>
          <Input
            id="businessWebsite"
            placeholder="https://yourwebsite.com"
            value={businessInfo.website || ''}
            onChange={(e) => handleInputChange('website', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessTaxId">Tax ID / Registration Number</Label>
        <Input
          id="businessTaxId"
          placeholder="12-3456789"
          value={businessInfo.taxId || ''}
          onChange={(e) => handleInputChange('taxId', e.target.value)}
          className="border-border focus:ring-primary"
        />
      </div>
    </div>
  );
};