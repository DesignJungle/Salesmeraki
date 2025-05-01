'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Table } from '@/components/common/Table';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { MagnifyingGlassIcon, FunnelIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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

export default function CustomersPage() {
  const { formatAmount, currency, convertAmount } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    status: 'active',
    industry: '',
    value: '',
    lastContact: format(new Date(), 'yyyy-MM-dd')
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Mock customer data - would be fetched from API in production
  const customers = [
    { id: '1', name: 'Acme Corporation', status: 'active', industry: 'Technology', valueRaw: 120000, lastContact: '2023-06-15' },
    { id: '2', name: 'Globex Industries', status: 'inactive', industry: 'Manufacturing', valueRaw: 85000, lastContact: '2023-05-22' },
    { id: '3', name: 'Initech LLC', status: 'active', industry: 'Finance', valueRaw: 210000, lastContact: '2023-06-18' },
    { id: '4', name: 'Umbrella Corp', status: 'active', industry: 'Healthcare', valueRaw: 175000, lastContact: '2023-06-10' },
    { id: '5', name: 'Stark Industries', status: 'active', industry: 'Technology', valueRaw: 320000, lastContact: '2023-06-20' },
  ];

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({
      ...prev,
      [name]: value
    }));

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

    if (!newCustomer.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!newCustomer.industry.trim()) {
      errors.industry = 'Industry is required';
    }

    if (!newCustomer.value.trim()) {
      errors.value = 'Value is required';
    } else if (!/^\$?\d+([,.]\d{1,3})*$/.test(newCustomer.value)) {
      errors.value = 'Value must be a valid currency amount';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddCustomer = () => {
    if (!validateForm()) return;

    // Parse the value to a number, removing currency symbols and formatting
    const valueStr = newCustomer.value.replace(/[^0-9.]/g, '');
    const valueNum = parseFloat(valueStr);

    // In a real app, this would be an API call
    const newCustomerWithId = {
      ...newCustomer,
      id: `${customers.length + 1}`,
      // Store the raw numeric value for proper currency formatting
      valueRaw: valueNum
    };

    // Add to the list (in a real app, this would happen after API success)
    customers.push(newCustomerWithId);

    // Close modal and reset form
    setIsAddModalOpen(false);
    setNewCustomer({
      name: '',
      status: 'active',
      industry: '',
      value: '',
      lastContact: format(new Date(), 'yyyy-MM-dd')
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Customers</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and analyze your customer relationships
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search customers..."
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
            <Button
              variant="outline"
              leftIcon={<ArrowPathIcon className="h-4 w-4" />}
              onClick={handleRefresh}
              isLoading={isLoading}
            >
              Refresh
            </Button>
          </div>
        </div>

        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Status</Table.HeaderCell>
              <Table.HeaderCell>Industry</Table.HeaderCell>
              <Table.HeaderCell>Customer Value</Table.HeaderCell>
              <Table.HeaderCell>Last Contact</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {filteredCustomers.map((customer) => (
              <Table.Row key={customer.id}>
                <Table.Cell className="font-medium">{customer.name}</Table.Cell>
                <Table.Cell>
                  <Badge variant={customer.status === 'active' ? 'success' : 'warning'}>
                    {customer.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell>{customer.industry}</Table.Cell>
                <Table.Cell>{formatAmount(customer.valueRaw, true)}</Table.Cell>
                <Table.Cell>{formatDate(customer.lastContact)}</Table.Cell>
                <Table.Cell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {/* Navigate to customer details */}}
                  >
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Customer Name</label>
            <Input
              id="name"
              name="name"
              value={newCustomer.name}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="Enter customer name"
            />
            {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700">Industry</label>
            <Input
              id="industry"
              name="industry"
              value={newCustomer.industry}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="Enter industry"
            />
            {formErrors.industry && <p className="mt-1 text-sm text-red-600">{formErrors.industry}</p>}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700">Value</label>
            <Input
              id="value"
              name="value"
              value={newCustomer.value}
              onChange={handleInputChange}
              className="mt-1 w-full"
              placeholder="$0.00"
            />
            {formErrors.value && <p className="mt-1 text-sm text-red-600">{formErrors.value}</p>}
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={newCustomer.status}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="lead">Lead</option>
            </select>
          </div>

          <div>
            <label htmlFor="lastContact" className="block text-sm font-medium text-gray-700">Last Contact</label>
            <Input
              id="lastContact"
              name="lastContact"
              type="date"
              value={newCustomer.lastContact}
              onChange={handleInputChange}
              className="mt-1 w-full"
            />
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
              onClick={handleAddCustomer}
            >
              Add Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
