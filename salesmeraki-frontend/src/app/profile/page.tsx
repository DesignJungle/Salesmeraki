'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  UserIcon, 
  KeyIcon, 
  BellIcon, 
  ShieldCheckIcon,
  CogIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  department?: string;
  location?: string;
  timezone?: string;
  bio?: string;
  notificationPreferences: {
    email: boolean;
    browser: boolean;
    mobile: boolean;
    digest: 'daily' | 'weekly' | 'never';
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    lastPasswordChange: Date;
    loginHistory: {
      date: Date;
      ip: string;
      device: string;
    }[];
  };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    location: '',
    timezone: '',
    bio: ''
  });
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }

    if (status === 'authenticated') {
      // In a real app, fetch from API
      setTimeout(() => {
        const mockProfile: UserProfile = {
          id: '1',
          name: session?.user?.name || 'User',
          email: session?.user?.email || 'user@example.com',
          role: 'Sales Representative',
          phone: '+1 (555) 123-4567',
          department: 'Sales',
          location: 'New York, NY',
          timezone: 'America/New_York',
          bio: 'Experienced sales professional with a focus on enterprise SaaS solutions.',
          notificationPreferences: {
            email: true,
            browser: true,
            mobile: false,
            digest: 'daily'
          },
          securitySettings: {
            twoFactorEnabled: false,
            lastPasswordChange: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
            loginHistory: [
              {
                date: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
                ip: '192.168.1.1',
                device: 'Chrome on Windows'
              },
              {
                date: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
                ip: '192.168.1.1',
                device: 'Mobile App on iPhone'
              },
              {
                date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
                ip: '192.168.1.1',
                device: 'Chrome on Mac'
              }
            ]
          }
        };
        
        setProfile(mockProfile);
        setFormData({
          name: mockProfile.name,
          email: mockProfile.email,
          phone: mockProfile.phone || '',
          department: mockProfile.department || '',
          location: mockProfile.location || '',
          timezone: mockProfile.timezone || '',
          bio: mockProfile.bio || ''
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [status, router, session]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNotificationChange = (key: keyof UserProfile['notificationPreferences'], value: any) => {
    if (!profile) return;
    
    setProfile({
      ...profile,
      notificationPreferences: {
        ...profile.notificationPreferences,
        [key]: value
      }
    });
  };

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // In a real app, save to API
    setTimeout(() => {
      if (profile) {
        const updatedProfile = {
          ...profile,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          department: formData.department,
          location: formData.location,
          timezone: formData.timezone,
          bio: formData.bio
        };
        
        setProfile(updatedProfile);
        setIsEditing(false);
        setNotification({
          type: 'success',
          message: 'Profile updated successfully!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const handleEnableTwoFactor = () => {
    setIsLoading(true);
    
    // In a real app, enable 2FA via API
    setTimeout(() => {
      if (profile) {
        setProfile({
          ...profile,
          securitySettings: {
            ...profile.securitySettings,
            twoFactorEnabled: true
          }
        });
        
        setNotification({
          type: 'success',
          message: 'Two-factor authentication enabled!'
        });
        
        // Clear notification after 3 seconds
        setTimeout(() => {
          setNotification(null);
        }, 3000);
      }
      
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">User Profile</h1>
      </div>

      {notification && (
        <div className={`mb-6 p-4 rounded-md ${
          notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircleIcon className="h-5 w-5 mr-2" />
            ) : (
              <XCircleIcon className="h-5 w-5 mr-2" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="flex border-b">
          <button
            className={`px-4 py-4 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('profile')}
          >
            <UserIcon className="h-5 w-5 inline mr-2" />
            Profile Information
          </button>
          <button
            className={`px-4 py-4 font-medium text-sm ${
              activeTab === 'notifications'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('notifications')}
          >
            <BellIcon className="h-5 w-5 inline mr-2" />
            Notification Settings
          </button>
          <button
            className={`px-4 py-4 font-medium text-sm ${
              activeTab === 'security'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('security')}
          >
            <ShieldCheckIcon className="h-5 w-5 inline mr-2" />
            Security
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Profile Information</h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-primary hover:text-primary-dark"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl mb-4">
                      {profile?.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      ) : (
                        profile?.name.charAt(0)
                      )}
                    </div>
                    {isEditing && (
                      <button className="text-primary hover:text-primary-dark text-sm">
                        Change Avatar
                      </button>
                    )}
                    <div className="mt-4 text-center">
                      <h3 className="font-medium text-gray-900">{profile?.name}</h3>
                      <p className="text-gray-500">{profile?.role}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.phone || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="department"
                          value={formData.department}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.department || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      ) : (
                        <p className="text-gray-900">{profile?.location || 'Not provided'}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timezone
                      </label>
                      {isEditing ? (
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="America/New_York">Eastern Time (ET)</option>
                          <option value="America/Chicago">Central Time (CT)</option>
                          <option value="America/Denver">Mountain Time (MT)</option>
                          <option value="America/Los_Angeles">Pacific Time (PT)</option>
                          <option value="Europe/London">London (GMT)</option>
                          <option value="Europe/Paris">Paris (CET)</option>
                        </select>
                      ) : (
                        <p className="text-gray-900">{profile?.timezone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && profile && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.notificationPreferences.email}
                          onChange={(e) => handleNotificationChange('email', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Browser Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications in your browser</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.notificationPreferences.browser}
                          onChange={(e) => handleNotificationChange('browser', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mobile Push Notifications</p>
                        <p className="text-sm text-gray-500">Receive notifications on your mobile device</p>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={profile.notificationPreferences.mobile}
                          onChange={(e) => handleNotificationChange('mobile', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-4">Notification Digest</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        id="digest-daily"
                        type="radio"
                        name="digest"
                        value="daily"
                        checked={profile.notificationPreferences.digest === 'daily'}
                        onChange={() => handleNotificationChange('digest', 'daily')}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="digest-daily" className="ml-2 block text-sm text-gray-900">
                        Daily digest
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="digest-weekly"
                        type="radio"
                        name="digest"
                        value="weekly"
                        checked={profile.notificationPreferences.digest === 'weekly'}
                        onChange={() => handleNotificationChange('digest', 'weekly')}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="digest-weekly" className="ml-2 block text-sm text-gray-900">
                        Weekly digest
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        id="digest-never"
                        type="radio"
                        name="digest"
                        value="never"
                        checked={profile.notificationPreferences.digest === 'never'}
                        onChange={() => handleNotificationChange('digest', 'never')}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                      />
                      <label htmlFor="digest-never" className="ml-2 block text-sm text-gray-900">
                        No digest
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                  >
                    Save Notification Settings
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && profile && (
            <div>
              <h2 className="text-lg font-semibold mb-6">Security Settings</h2>
              
              <div className="space-y-8">
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-md font-medium flex items-center">
                        <KeyIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Password
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Last changed {formatDate(profile.securitySettings.lastPasswordChange)}
                      </p>
                    </div>
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                      Change Password
                    </button>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-md font-medium flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2 text-gray-500" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {profile.securitySettings.twoFactorEnabled
                          ? 'Enabled - Your account is more secure'
                          : 'Disabled - Enable for additional security'}
                      </p>
                    </div>
                    {!profile.securitySettings.twoFactorEnabled ? (
                      <button
                        onClick={handleEnableTwoFactor}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark"
                      >
                        Enable 2FA
                      </button>
                    ) : (
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200">
                        Manage 2FA
                      </button>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-4 flex items-center">
                    <CogIcon className="h-5 w-5 mr-2 text-gray-500" />
                    Login History
                  </h3>
                  <div className="border rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Device
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {profile.securitySettings.loginHistory.map((login, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(login.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {login.ip}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {login.device}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
