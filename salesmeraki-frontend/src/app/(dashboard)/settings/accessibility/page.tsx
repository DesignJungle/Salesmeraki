'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/common/Button';
import { Switch } from '@/components/common/Switch';
import {
  EyeIcon,
  SpeakerWaveIcon,
  KeyboardIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function AccessibilitySettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 100,
    reducedMotion: false,
    keyboardNavigation: false,
    screenReader: false,
    autoplay: false,
    animations: true,
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHighContrast = localStorage.getItem('high-contrast-mode') === 'true';
      const savedFontSize = parseInt(localStorage.getItem('font-size') || '100', 10);
      const savedReducedMotion = localStorage.getItem('reduced-motion') === 'true';
      const savedKeyboardNavigation = localStorage.getItem('keyboard-navigation') === 'true';
      const savedScreenReader = localStorage.getItem('screen-reader') === 'true';
      const savedAutoplay = localStorage.getItem('autoplay') === 'true';
      const savedAnimations = localStorage.getItem('animations') !== 'false'; // Default to true

      setSettings({
        highContrast: savedHighContrast,
        fontSize: savedFontSize,
        reducedMotion: savedReducedMotion,
        keyboardNavigation: savedKeyboardNavigation,
        screenReader: savedScreenReader,
        autoplay: savedAutoplay,
        animations: savedAnimations,
      });
    }
  }, []);

  // Apply settings when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // High Contrast
      localStorage.setItem('high-contrast-mode', String(settings.highContrast));
      if (settings.highContrast) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }

      // Font Size
      localStorage.setItem('font-size', String(settings.fontSize));
      document.documentElement.style.fontSize = `${settings.fontSize}%`;

      // Reduced Motion
      localStorage.setItem('reduced-motion', String(settings.reducedMotion));
      if (settings.reducedMotion) {
        document.documentElement.classList.add('reduced-motion');
      } else {
        document.documentElement.classList.remove('reduced-motion');
      }

      // Other settings
      localStorage.setItem('keyboard-navigation', String(settings.keyboardNavigation));
      localStorage.setItem('screen-reader', String(settings.screenReader));
      localStorage.setItem('autoplay', String(settings.autoplay));
      localStorage.setItem('animations', String(settings.animations));

      if (!settings.animations) {
        document.documentElement.classList.add('no-animations');
      } else {
        document.documentElement.classList.remove('no-animations');
      }
    }
  }, [settings]);

  const updateSetting = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    const defaultSettings = {
      highContrast: false,
      fontSize: 100,
      reducedMotion: false,
      keyboardNavigation: false,
      screenReader: false,
      autoplay: false,
      animations: true,
    };

    setSettings(defaultSettings);
  };

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Accessibility Settings</h1>
          <p className="mt-2 text-sm text-gray-600">
            Customize your accessibility preferences
          </p>
        </div>
        <Button
          variant="outline"
          onClick={resetSettings}
          aria-label="Reset all accessibility settings to default values"
          leftIcon={<ArrowPathIcon className="h-5 w-5" />}
        >
          Reset to Defaults
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="space-y-8">
            {/* Visual Settings */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <EyeIcon className="h-5 w-5 mr-2 text-primary" />
                Visual Settings
              </h2>

              <div className="space-y-6">
                {/* High Contrast Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">High Contrast Mode</h3>
                    <p className="text-sm text-gray-500">Increase contrast for better readability</p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(checked) => updateSetting('highContrast', checked)}
                  />
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Font Size</h3>
                    <span className="text-sm font-medium">{settings.fontSize}%</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('fontSize', Math.max(80, settings.fontSize - 10))}
                      aria-label="Decrease font size"
                      disabled={settings.fontSize <= 80}
                    >
                      <span className="text-lg font-bold">A-</span>
                    </Button>

                    <div className="flex-1">
                      <input
                        type="range"
                        min="80"
                        max="150"
                        step="10"
                        value={settings.fontSize}
                        onChange={(e) => updateSetting('fontSize', parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        aria-label="Adjust font size"
                      />
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateSetting('fontSize', Math.min(150, settings.fontSize + 10))}
                      aria-label="Increase font size"
                      disabled={settings.fontSize >= 150}
                    >
                      <span className="text-lg font-bold">A+</span>
                    </Button>
                  </div>
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enable Animations</h3>
                    <p className="text-sm text-gray-500">Show animations and transitions</p>
                  </div>
                  <Switch
                    checked={settings.animations}
                    onCheckedChange={(checked) => updateSetting('animations', checked)}
                  />
                </div>

                {/* Reduced Motion */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Reduced Motion</h3>
                    <p className="text-sm text-gray-500">Minimize animations and motion effects</p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Input Settings */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <KeyboardIcon className="h-5 w-5 mr-2 text-primary" />
                Input Settings
              </h2>

              <div className="space-y-6">
                {/* Keyboard Navigation */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Enhanced Keyboard Navigation</h3>
                    <p className="text-sm text-gray-500">Improve navigation using keyboard shortcuts</p>
                  </div>
                  <Switch
                    checked={settings.keyboardNavigation}
                    onCheckedChange={(checked) => updateSetting('keyboardNavigation', checked)}
                  />
                </div>
              </div>
            </div>

            {/* Media Settings */}
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <SpeakerWaveIcon className="h-5 w-5 mr-2 text-primary" />
                Media Settings
              </h2>

              <div className="space-y-6">
                {/* Autoplay Media */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Autoplay Media</h3>
                    <p className="text-sm text-gray-500">Automatically play videos and audio</p>
                  </div>
                  <Switch
                    checked={settings.autoplay}
                    onCheckedChange={(checked) => updateSetting('autoplay', checked)}
                  />
                </div>

                {/* Screen Reader */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Screen Reader Optimization</h3>
                    <p className="text-sm text-gray-500">Optimize content for screen readers</p>
                  </div>
                  <Switch
                    checked={settings.screenReader}
                    onCheckedChange={(checked) => updateSetting('screenReader', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
