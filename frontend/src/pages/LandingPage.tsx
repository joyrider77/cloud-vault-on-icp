import { useNavigate } from "@tanstack/react-router";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Key, Fingerprint, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";

export default function LandingPage() {
  const navigate = useNavigate();
  const {
    login,
    isLoggingIn,
    isLoginSuccess,
    identity,
    isInitializing,
  } = useInternetIdentity();

  // If already authenticated (e.g. stored session restored), redirect immediately to vault
  useEffect(() => {
    if (!isInitializing && identity) {
      navigate({ to: "/vault" });
    }
  }, [isInitializing, identity, navigate]);

  // After a successful fresh login, redirect to vault
  useEffect(() => {
    if (isLoginSuccess) {
      navigate({ to: "/vault" });
    }
  }, [isLoginSuccess, navigate]);

  const handleGetStarted = async () => {
    // If already authenticated, go straight to vault
    if (identity) {
      navigate({ to: "/vault" });
      return;
    }
    // If still initializing, do nothing
    if (isInitializing) return;

    try {
      await login();
    } catch (error) {
      const message = error instanceof Error ? error.message.toLowerCase() : "";
      if (message.includes("cancel") || message.includes("user closed")) {
        // User cancelled — no toast needed
        return;
      }
      toast.error("Login failed. Please try again.", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        duration: 4000,
      });
    }
  };

  const isButtonDisabled = isLoggingIn || isInitializing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Shield className="w-10 h-10 text-primary" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Your Digital Vault
            <span className="block text-primary mt-2">Secured on the Blockchain</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Store your passwords, credit cards, and sensitive information with military-grade encryption.
            Powered by Internet Computer's decentralized infrastructure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              disabled={isButtonDisabled}
              className="text-lg px-8 py-6 min-w-[200px]"
            >
              {isLoggingIn || isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {isInitializing ? "Loading…" : "Connecting…"}
                </>
              ) : (
                <>
                  <Key className="mr-2 h-5 w-5" />
                  Get Started
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">End-to-End Encryption</h3>
            <p className="text-muted-foreground">
              Your data is encrypted before it leaves your device. Only you have the keys.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Blockchain Security</h3>
            <p className="text-muted-foreground">
              Built on Internet Computer's decentralized network for maximum security and reliability.
            </p>
          </div>

          <div className="bg-card border rounded-lg p-6 space-y-4 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Fingerprint className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Internet Identity</h3>
            <p className="text-muted-foreground">
              Secure authentication without passwords using cryptographic keys and biometrics.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-primary/5 rounded-2xl p-12 border">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to Secure Your Digital Life?
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of users who trust their sensitive data to our blockchain-powered vault.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            disabled={isButtonDisabled}
            className="text-lg px-8 py-6"
          >
            {isLoggingIn || isInitializing ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {isInitializing ? "Loading…" : "Connecting…"}
              </>
            ) : (
              <>
                <Key className="mr-2 h-5 w-5" />
                Start Securing Now
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
