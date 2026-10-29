import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { profileService } from '../../services/profile.service';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  Mail,
  Phone,
  Shield,
  CheckCircle2,
  AlertCircle,
  Globe,
  LogOut,
  Save,
} from 'lucide-react';

export const CitizenProfilePage: React.FC = () => {
  const { user, refreshUser, logout } = useAuth();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    setIsSubmitting(true);
    try {
      await profileService.updateProfile({
        fullName: fullName.trim(),
        phone: phone.trim() ? phone.trim() : undefined,
      });
      await refreshUser();
      setSuccessMessage('Profile information updated successfully.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-brandText">Citizen Profile</h1>
        <p className="text-sm text-brandText-muted mt-1">
          Manage your personal details, contact preferences, and security settings.
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card title="Account Information" subtitle="Your verified identity on CivicFix">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              required
              prefixIcon={<User className="w-4 h-4 text-brandText-muted" />}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-brandText mb-1">
                Email Address (Verified)
              </label>
              <div className="relative">
                <Input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  prefixIcon={<Mail className="w-4 h-4 text-brandText-muted" />}
                  className="bg-slate-50 cursor-not-allowed opacity-80"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mobile Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              prefixIcon={<Phone className="w-4 h-4 text-brandText-muted" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-brandText mb-1">
                Account Role
              </label>
              <div className="pt-2">
                <Badge variant="blue" className="text-xs capitalize py-1 px-3">
                  <Shield className="w-3.5 h-3.5 mr-1" /> {user?.role || 'Citizen'}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brandText mb-1">
              Preferred Language for SMS & Notifications
            </label>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-brandText-muted" />
              <select
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                className="w-full sm:w-64 rounded-xl border border-border-light bg-white px-3 py-2 text-sm text-brandText focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-border-light flex justify-end">
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              <Save className="w-4 h-4 mr-1.5" /> Save Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Privacy & DPDP Notice */}
      <Card title="Privacy & DPDP Compliance" subtitle="Digital Personal Data Protection Act, 2023">
        <div className="text-xs text-brandText-muted space-y-2 leading-relaxed">
          <p>
            CivicFix stores your contact details exclusively for tracking civic complaints and dispatching municipal status notifications.
          </p>
          <p>
            Your exact GPS coordinates are attached solely to municipal work orders to ensure field crews can pinpoint infrastructure defects.
          </p>
        </div>
      </Card>

      {/* Session Termination */}
      <div className="p-4 bg-rose-50/60 border border-rose-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-rose-900">Sign Out of CivicFix</h4>
          <p className="text-xs text-rose-700 mt-0.5">
            End your active session securely on this browser.
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={logout}
          className="shrink-0"
        >
          <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
        </Button>
      </div>
    </div>
  );
};
