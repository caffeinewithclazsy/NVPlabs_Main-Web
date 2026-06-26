import { LiquidButton } from "./LiquidButton";

/**
 * Sign in with Google via Emergent Auth.
 * REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
 */
export function GoogleSignInButton({ label = "Continue with Google", testid = "google-signin", className = "" }) {
  const onClick = () => {
    const redirectUrl = window.location.origin + "/auth/callback";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  };
  return (
    <LiquidButton
      type="button"
      variant="glass"
      size="lg"
      onClick={onClick}
      className={`w-full ${className}`}
      data-testid={testid}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M21.6 12.227c0-.709-.064-1.39-.182-2.045H12v3.868h5.382a4.6 4.6 0 0 1-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.351z" />
        <path fill="#34A853" d="M12 22c2.7 0 4.964-.895 6.618-2.422l-3.232-2.51c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.596-4.123H3.064v2.59A9.996 9.996 0 0 0 12 22z" />
        <path fill="#FBBC05" d="M6.404 13.9A6.005 6.005 0 0 1 6.09 12c0-.66.114-1.302.314-1.9V7.51H3.064A9.996 9.996 0 0 0 2 12c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" />
        <path fill="#EA4335" d="M12 6.18c1.47 0 2.79.505 3.83 1.498l2.87-2.87C16.96 3.16 14.696 2 12 2A9.996 9.996 0 0 0 3.064 7.51l3.34 2.59C7.19 7.94 9.395 6.18 12 6.18z" />
      </svg>
      {label}
    </LiquidButton>
  );
}
