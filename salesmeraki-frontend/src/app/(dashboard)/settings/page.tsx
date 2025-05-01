'use client';

import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/common/Tabs';
import { Switch } from '@/components/common/Switch';
import { CurrencySettings } from '@/components/settings/CurrencySettings';

// Consistent date formatting function to avoid hydration errors
const formatDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'MM/dd/yyyy');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Fallback to the original string
  }
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Mock user data
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Sales Manager',
    company: 'Acme Inc.',
    phone: '+1 (555) 123-4567',
  });

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    opportunityAlerts: true,
    teamUpdates: false,
  });

  // Mock integrations
  const [integrations, setIntegrations] = useState([
    { id: '1', name: 'Salesforce', connected: true, lastSync: '2023-05-15T10:30:00Z' },
    { id: '2', name: 'HubSpot', connected: false, lastSync: null },
    { id: '3', name: 'Slack', connected: true, lastSync: '2023-05-14T08:15:00Z' },
    { id: '4', name: 'Google Calendar', connected: true, lastSync: '2023-05-15T09:45:00Z' },
    { id: '5', name: 'Microsoft Teams', connected: false, lastSync: null },
  ]);

  const handleToggleIntegration = (id: string) => {
    setIntegrations(integrations.map(integration =>
      integration.id === id
        ? { ...integration, connected: !integration.connected }
        : integration
    ));
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger asChild>
            <a href="/settings/accessibility">Accessibility</a>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Personal Information</h3>
            <div className="space-y-4 max-w-md">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <Input
                  id="role"
                  value={userData.role}
                  onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <Input
                  id="company"
                  value={userData.company}
                  onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    setIsLoading(true);
                    // Simulate API call
                    setTimeout(() => setIsLoading(false), 1000);
                  }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
                  <p className="text-sm text-gray-500">Receive notifications in browser</p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Weekly Reports</h4>
                  <p className="text-sm text-gray-500">Get performance summaries weekly</p>
                </div>
                <Switch
                  checked={notificationSettings.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Opportunity Alerts</h4>
                  <p className="text-sm text-gray-500">Be notified of new sales opportunities</p>
                </div>
                <Switch
                  checked={notificationSettings.opportunityAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, opportunityAlerts: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Team Updates</h4>
                  <p className="text-sm text-gray-500">Get notified about team activities</p>
                </div>
                <Switch
                  checked={notificationSettings.teamUpdates}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({ ...notificationSettings, teamUpdates: checked })
                  }
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Connected Services</h3>
            <div className="space-y-6">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{integration.name}</h4>
                    <p className="text-sm text-gray-500">
                      {integration.connected && integration.lastSync
                        ? `Last synced: ${formatDate(integration.lastSync)}`
                        : integration.connected
                          ? 'Connected'
                          : 'Not connected'}
                    </p>
                  </div>
                  <Button
                    variant={integration.connected ? "secondary" : "primary"}
                    size="sm"
                    onClick={() => handleToggleIntegration(integration.id)}
                  >
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Team Management</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your team members and their permissions
            </p>
            {/* Team management content would go here */}
            <div className="text-center py-8">
              <p className="text-gray-500">Team management features coming soon</p>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="mt-6">
          <CurrencySettings />
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Billing Information</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your subscription and payment methods
            </p>
            {/* Billing content would go here */}
            <div className="text-center py-8">
              <p className="text-gray-500">Billing features coming soon</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
