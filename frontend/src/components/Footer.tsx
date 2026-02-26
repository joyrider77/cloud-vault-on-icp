import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'cloud-vault-icp';

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container flex h-16 items-center justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1.5">
          © {currentYear} Cloud Vault. Built with{' '}
          <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
