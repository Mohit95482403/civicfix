import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { MailCheck, ArrowRight } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || 'your email';

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
          Verify your email
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm border border-border-light rounded-2xl sm:px-10 text-center space-y-5">
          <div className="w-16 h-16 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-inner">
            <MailCheck className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-brandText">Confirmation email sent</h3>
            <p className="mt-2 text-sm text-brandText-muted leading-relaxed">
              We have sent a verification link to <span className="font-semibold text-brandText">{email}</span>. Please click the link inside to activate your account and start reporting civic issues.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-brandText-muted text-left space-y-1.5">
            <p className="font-semibold text-brandText">Haven't received the email?</p>
            <p>1. Check your spam or promotional folders.</p>
            <p>2. In local test environment, Supabase auto-confirms or emails via Inbucket.</p>
          </div>

          <div className="pt-2">
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Continue to Sign In <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
