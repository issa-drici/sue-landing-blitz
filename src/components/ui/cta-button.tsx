import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const CTAButton = forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          "bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]",
          "px-8 py-4 min-w-[200px] shadow-lg hover:shadow-xl",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);
CTAButton.displayName = "CTAButton";

export { CTAButton };