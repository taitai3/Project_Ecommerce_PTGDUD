import React, { useState, useEffect } from 'react';
import {
  Save,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import { authService } from '../services/authService';
import Toast from '../components/Toast';
import { useTheme } from '../context/ThemeContext';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const { isDark } = useTheme();
  
  // Profile data
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    role: ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    marketing: false,
  });

  // Load user profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setProfileLoading(true);
      const data = await authService.getProfile();
      setProfile({
        username: data.username || '',
        email: data.email || '',
        fullName: data.fullName || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
        role: data.role || ''
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to load profile: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await authService.updateProfile({
        email: profile.email,
        fullName: profile.fullName,
        phone: profile.phoneNumber,
        address: profile.address
      });
      setToast({
        type: 'success',
        message: 'Profile updated successfully!'
      });
    } catch (error) {
      setToast({
        type: 'error',
        message: 'Failed to update profile: ' + (error.response?.data?.message || error.message)
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ];

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-600 dark:text-slate-400">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Profile Information</h2>
                  <button 
                    onClick={handleSaveProfile}
                    disabled={loading || profileLoading}
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>

                {profileLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                          {profile.username}
                        </div>
                        <div className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400">
                          {profile.role}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Username (Read-only)
                        </label>
                        <input
                          type="text"
                          value={profile.username}
                          disabled
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => handleProfileChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={profile.fullName}
                          onChange={(e) => handleProfileChange('fullName', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={profile.phoneNumber}
                          onChange={(e) => handleProfileChange('phoneNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Address
                      </label>
                      <textarea
                        rows={4}
                        value={profile.address}
                        onChange={(e) => handleProfileChange('address', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Notification Preferences</h2>
                  <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.email}
                        onChange={() => handleNotificationChange('email')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive push notifications in browser</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.push}
                        onChange={() => handleNotificationChange('push')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <Smartphone className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">SMS Notifications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive notifications via SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.sms}
                        onChange={() => handleNotificationChange('sms')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div className="flex items-center space-x-3">
                      <Globe className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      <div>
                        <h3 className="font-medium text-slate-900 dark:text-white">Marketing Communications</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Receive marketing emails and updates</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.marketing}
                        onChange={() => handleNotificationChange('marketing')}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 dark:bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab - Will be implemented in Part 2 */}
            {activeTab === 'security' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Security Settings</h2>
                </div>
                <div className="text-center py-12">
                  <Shield className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Change password feature coming in Part 2</p>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Appearance Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-4 border-b border-slate-200 dark:border-slate-700">
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-white">Dark Mode</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Toggle dark mode theme</p>
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Use the toggle in the header
                    </div>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">More appearance options coming soon.</p>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Billing Information</h2>
                <div className="text-center py-12">
                  <CreditCard className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Billing features coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;