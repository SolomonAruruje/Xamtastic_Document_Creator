import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ClientInfo } from "@/types";

interface ClientFormProps {
  clientInfo: ClientInfo;
  onClientInfoChange: (info: ClientInfo) => void;
}

export const ClientForm = ({ clientInfo, onClientInfoChange }: ClientFormProps) => {
  const handleInputChange = (field: keyof ClientInfo, value: string) => {
    onClientInfoChange({
      ...clientInfo,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name *</Label>
          <Input
            id="clientName"
            placeholder="Client or Company Name"
            value={clientInfo.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email *</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="client@example.com"
            value={clientInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientAddress">Address *</Label>
        <Input
          id="clientAddress"
          placeholder="456 Client Avenue"
          value={clientInfo.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          className="border-border focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="clientCity">City *</Label>
          <Input
            id="clientCity"
            placeholder="Los Angeles"
            value={clientInfo.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientPostalCode">Postal Code *</Label>
          <Input
            id="clientPostalCode"
            placeholder="90210"
            value={clientInfo.postalCode}
            onChange={(e) => handleInputChange('postalCode', e.target.value)}
            className="border-border focus:ring-primary"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientPhone">Phone</Label>
        <Input
          id="clientPhone"
          placeholder="+1 (555) 987-6543"
          value={clientInfo.phone || ''}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          className="border-border focus:ring-primary"
        />
      </div>
    </div>
  );
};