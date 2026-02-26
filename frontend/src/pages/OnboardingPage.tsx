import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Key, CheckCircle2 } from 'lucide-react';
import { useEffect } from 'react';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { identity, isLoginSuccess } = useInternetIdentity();

  useEffect(() => {
    if (!isLoginSuccess || !identity) {
      navigate({ to: '/' });
    }
  }, [isLoginSuccess, identity, navigate]);

  const steps = [
    {
      icon: Shield,
      title: 'Your Vault is Ready',
      description: 'Your personal vault has been created and is secured with Internet Identity authentication.',
    },
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All your data is encrypted with a canister-owned key before being stored on the Internet Computer.',
    },
    {
      icon: Key,
      title: 'Complete Control',
      description: 'Only you can access your vault. Your data is private, secure, and always available.',
    },
  ];

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
      <div className="flex w-full max-w-4xl flex-col gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg">
            <CheckCircle2 className="h-12 w-12 text-primary-foreground" />
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-4xl font-bold tracking-tight">Welcome to Cloud Vault!</h1>
            <p className="text-lg text-muted-foreground">
              Your secure password manager is ready to use
            </p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/vault' })}
            className="h-12 px-8 text-base font-semibold"
          >
            Open My Vault
          </Button>
          <p className="text-sm text-muted-foreground">
            You can access your vault anytime from the header menu
          </p>
        </div>
      </div>
    </div>
  );
}
