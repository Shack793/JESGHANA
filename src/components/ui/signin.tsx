import * as React from "react";
import { useAuth } from "@usehercules/auth/react";
import { LogIn, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button, type ButtonProps } from "@/components/ui/button.tsx";

export interface SignInButtonProps extends ButtonProps {
  showIcon?: boolean;
  signInText?: string;
  signOutText?: string;
  loadingText?: string;
  onClick?: () => void;
}

export const SignInButton = React.forwardRef<
  HTMLButtonElement,
  SignInButtonProps
>(
  (
    {
      onClick,
      disabled,
      showIcon = true,
      signInText = "Sign In",
      signOutText = "Sign Out",
      loadingText,
      className,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const { isAuthenticated, signin, signout, isLoading, error } = useAuth();

    React.useEffect(() => {
      if (error) {
        toast.error("Login error", { description: error.message });
        console.error("Login error", error);
      }
    }, [error]);

    const handleClick = React.useCallback(async () => {
      onClick?.();
      try {
        if (isAuthenticated) await signout();
        else await signin();
      } catch (e) {
        console.error("Authentication error:", e);
      }
    }, [isAuthenticated, signout, signin, onClick]);

    const isDisabled = disabled || isLoading;
    const label = isLoading
      ? loadingText || (isAuthenticated ? "Signing Out..." : "Signing In...")
      : isAuthenticated
        ? signOutText
        : signInText;
    const icon = isLoading ? (
      <Loader2 className="size-4 animate-spin" />
    ) : isAuthenticated ? (
      <LogOut className="size-4" />
    ) : (
      <LogIn className="size-4" />
    );

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        disabled={isDisabled}
        variant={variant}
        size={size}
        className={className}
        asChild={asChild}
        aria-label={
          isAuthenticated ? "Sign out of your account" : "Sign in to your account"
        }
        aria-describedby={error ? "auth-error" : undefined}
        {...props}
      >
        {showIcon && icon}
        {label}
      </Button>
    );
  },
);

SignInButton.displayName = "SignInButton";
