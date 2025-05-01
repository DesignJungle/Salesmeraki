'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { Modal } from '@/components/common/Modal';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { useCurrency } from '@/contexts/CurrencyContext';

// Consistent date formatting function to avoid hydration errors
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'MM/dd/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Fallback to the original string
  }
};

export default function OpportunitiesPage() {
  const { formatAmount, currency, convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: '',
    customer: '',
    stage: 'Discovery',
    value: '',
    probability: 20,
    closeDate: format(new Date(), 'yyyy-MM-dd')
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock opportunity data - would be fetched from API in production
  // Store raw numeric values for proper currency conversion
  const opportunities = [
    { id: '1', name: 'Acme Enterprise Deal', customer: 'Acme Corporation', stage: 'Proposal', valueRaw: 120000, probability: 70, closeDate: '2023-07-15' },
    { id: '2', name: 'Globex Software Upgrade', customer: 'Globex Industries', stage: 'Negotiation', valueRaw: 85000, probability: 85, closeDate: '2023-08-22' },
    { id: '3', name: 'Initech Security Suite', customer: 'Initech LLC', stage: 'Discovery', valueRaw: 210000, probability: 30, closeDate: '2023-09-18' },
    { id: '4', name: 'Umbrella Healthcare Platform', customer: 'Umbrella Corp', stage: 'Closed Won', valueRaw: 175000, probability: 100, closeDate: '2023-06-10' },
    { id: '5', name: 'Stark Tech Integration', customer: 'Stark Industries', stage: 'Qualification', valueRaw: 320000, probability: 20, closeDate: '2023-10-20' },
  ];

  const filteredOpportunities = opportunities.filter(opportunity =>
    opportunity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    opportunity.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Discovery': return 'blue';
      case 'Qualification': return 'indigo';
      case 'Proposal': return 'yellow';
      case 'Negotiation': return 'orange';
      case 'Closed Won': return 'green';
      case 'Closed Lost': return 'red';
      default: return 'gray';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    // Handle special case for probability which should be a number
    if (name === 'probability') {
      const numValue = parseInt(value, 10);
      setNewOpportunity(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setNewOpportunity(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newOpportunity.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!newOpportunity.customer.trim()) {
      errors.customer = 'Customer is required';
    }

    if (!newOpportunity.value.trim()) {
      errors.value = 'Value is required';
    } else if (!/^\$?\d+([,.]\d{1,3})*$/.test(newOpportunity.value)) {
      errors.value = 'Value must be a valid currency amount';
    }

    if (!newOpportunity.closeDate) {
      errors.closeDate = 'Close date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddOpportunity = () => {
    if (!validateForm()) return;

    // Parse the value to a number, removing currency symbols and formatting
    const valueStr = newOpportunity.value.replace(/[^0-9.]/g, '');
    const valueNum = parseFloat(valueStr);

    // In a real app, this would be an API call
    const newOpportunityWithId = {
      ...newOpportunity,
      id: `${opportunities.length + 1}`,
      // Store the raw numeric value for proper currency formatting
      valueRaw: valueNum
    };

    // Add to the list (in a real app, this would happen after API success)
    opportunities.push(newOpportunityWithId);

    // Close modal and reset form
    setIsAddModalOpen(false);
    setNewOpportunity({
      name: '',
      customer: '',
      stage: 'Discovery',
      value: '',
      probability: 20,
      closeDate: format(new Date(), 'yyyy-MM-dd')
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Opportunities</h1>
            <p className="mt-2 text-sm text-gray-600">
              Track and manage your sales pipeline
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Opportunity
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Total Pipeline</h3>
          <p className="text-2xl font-bold">{formatAmount(910000, true)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Weighted Pipeline</h3>
          <p className="text-2xl font-bold">{formatAmount(487500, true)}</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
          <p className="text-2xl font-bold">64%</p>
        </Card>
        <Card>
          <h3 className="text-sm font-medium text-gray-500">Avg. Deal Size</h3>
          <p className="text-2xl font-bold">{formatAmount(182000, true)}</p>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search opportunities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              leftIcon={<FunnelIcon className="h-4 w-4" />}
              onClick={() => {/* Open filter modal */}}
            >
              Filter
            </Button>
          </div>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Opportunity</Table.HeaderCell>
              <Table.HeaderCell>Customer</Table.HeaderCell>
              <Table.HeaderCell>Stage</Table.HeaderCell>
              <Table.HeaderCell>Value</Table.HeaderCell>
              <Table.HeaderCell>Probability</Table.HeaderCell>
              <Table.HeaderCell>Close Date</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredOpportunities.map((opportunity) => (
              <Table.Row key={opportunity.id}>
                <Table.Cell className="font-medium">{opportunity.name}</Table.Cell>
                <Table.Cell>{opportunity.customer}</Table.Cell>
                <Table.Cell>
                  <Badge variant={getStageColor(opportunity.stage)}>
                    {opportunity.stage}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{formatAmount(opportunity.valueRaw, true)}</Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <ProgressBar value={opportunity.probability} max={100} />
                    <span>{opportunity.probability}%</span>
                  </div>
                </Table.Cell>
                <Table.Cell>{formatDate(opportunity.closeDate)}</Table.Cell>
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Navigate to opportunity details */}}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      {/* Add Opportunity Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Opportunity"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Opportunity Name</label>
            <Input
              id="name"
              name="name"
              value={newOpportunity.name}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="Enter opportunity name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="customer" className="block text-sm font-medium text-gray-700">Customer</label>
            <Input
              id="customer"
              name="customer"
              value={newOpportunity.customer}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="Enter customer name"
            />
            {formErrors.customer && <p className="mt-1 text-sm text-red-600">{formErrors.customer}</p>}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
            <Input
              id="value"
              name="value"
              value={newOpportunity.value}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="$0.00"
            />
            {formErrors.value && <p className="mt-1 text-sm text-red-600">{formErrors.value}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stage" className="block text-sm font-medium text-gray-700">Stage</label>
              <select
                id="stage"
                name="stage"
                value={newOpportunity.stage}
                onChange={handleInputChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
              >
                <option value="Discovery">Discovery</option>
                <option value="Qualification">Qualification</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Closed Won">Closed Won</option>
                <option value="Closed Lost">Closed Lost</option>
              </select>
            </div>

            <div>
              <label htmlFor="probability" className="block text-sm font-medium text-gray-700">Probability (%)</label>
              <Input
                id="probability"
                name="probability"
                type="number"
                min="0"
                max="100"
                value={newOpportunity.probability}
                onChange={handleInputChange}
                className="mt-1 w-full"
              />
              <div className="mt-2">
                <ProgressBar value={newOpportunity.probability} max={100} size="sm" />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="closeDate" className="block text-sm font-medium text-gray-700">Expected Close Date</label>
            <Input
              id="closeDate"
              name="closeDate"
              type="date"
              value={newOpportunity.closeDate}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
            {formErrors.closeDate && <p className="mt-1 text-sm text-red-600">{formErrors.closeDate}</p>}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleAddOpportunity}
            >
              Add Opportunity
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
