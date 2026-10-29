import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface-canvas flex flex-col justify-center items-center px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4 border border-rose-100 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <span className="font-mono text-sm font-bold text-primary">404 ERROR</span>
      <h1 className="text-3xl font-extrabold text-brandText mt-1">Page Not Found</h1>
      <p className="text-sm text-brandText-muted mt-2 max-w-md">
        The requested civic portal route does not exist or may have been relocated within the unified CivicFix application.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Go Back
        </Button>
        <Link to="/">
          <Button variant="primary">
            <Home className="w-4 h-4 mr-1.5" /> Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
