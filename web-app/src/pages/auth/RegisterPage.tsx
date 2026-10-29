import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, Lock, User, Phone, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!fullName.trim()) {
      setLocalError('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setLocalError('Email address is required.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setLocalError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() ? phone.trim() : undefined,
      });

      if (res.emailVerificationRequired) {
        navigate('/verify-email', { state: { email } });
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setLocalError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-primary to-teal-civic flex items-center justify-center text-white font-bold text-xl shadow-md">
            CF
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-brandText">CivicFix</span>
        </Link>
        <h2 className="mt-5 text-center text-2xl font-bold tracking-tight text-brandText">
          Create Citizen Account
        </h2>
        <p className="mt-2 text-center text-sm text-brandText-muted">
          Join thousands of citizens reporting and tracking local community improvements.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-border-light rounded-2xl sm:px-10">
          <div className="mb-5 p-3 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900 leading-relaxed">
              Public registration creates verified <span className="font-semibold">Citizen</span> accounts. Municipal staff and supervisors are provisioned via administrative invitation.
            </p>
          </div>

          {localError && (
            <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-700 leading-snug">{localError}</div>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Full Name"
              type="text"
              required
              prefixIcon={<User className="w-4 h-4 text-brandText-muted" />}
              placeholder="e.g. Ramesh Kumar"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              autoComplete="email"
              required
              prefixIcon={<Mail className="w-4 h-4 text-brandText-muted" />}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Mobile Number (Optional)"
              type="tel"
              prefixIcon={<Phone className="w-4 h-4 text-brandText-muted" />}
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              prefixIcon={<Lock className="w-4 h-4 text-brandText-muted" />}
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              autoComplete="new-password"
              required
              prefixIcon={<Lock className="w-4 h-4 text-brandText-muted" />}
              placeholder="Repeat your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-border-light text-primary focus:ring-primary"
              />
              <label htmlFor="terms" className="text-xs text-brandText-muted leading-tight">
                I agree to the <span className="text-primary font-medium">Terms of Service</span> and{' '}
                <span className="text-primary font-medium">Privacy Policy</span> regarding civic issue reporting under DPDP guidelines.
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={isSubmitting}
            >
              Create Account <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-brandText-muted">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary hover:text-primary-dark">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
