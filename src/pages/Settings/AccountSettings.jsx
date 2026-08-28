import { Routes, Route, Navigate } from 'react-router-dom';
import '../../styles/settings.css';
import { SettingsLayout } from './SettingsLayout';
import { ProfileTab } from './tabs/ProfileTab';
import { SecurityTab } from './tabs/SecurityTab';
import { NotificationsTab } from './tabs/NotificationsTab';
import { DataPrivacyTab } from './tabs/DataPrivacyTab';
import { AppearanceTab } from './tabs/AppearanceTab';

export function AccountSettings() {
  return (
    <Routes>
      <Route element={<SettingsLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="security" element={<SecurityTab />} />
        <Route path="notifications" element={<NotificationsTab />} />
        <Route path="data-privacy" element={<DataPrivacyTab />} />
        <Route path="appearance" element={<AppearanceTab />} />
      </Route>
    </Routes>
  );
}
