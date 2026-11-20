import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

const buttonVariants = cva(
  "relative group border text-foreground mx-auto text-center rounded-full inline-flex items-center justify-center font-medium transition-all duration-300 cursor-pointer overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-blue-500/5 hover:bg-blue-500/0 border-blue-500/20",
        solid:
          "bg-blue-500 hover:bg-blue-600 text-white border-transparent hover:border-foreground/50 transition-all duration-200",
        ghost:
          "border-transparent bg-transparent hover:border-zinc-600 hover:bg-white/10",
        glass:
          "bg-violet-600/15 backdrop-blur-md border-violet-500/30 text-white hover:border-violet-400/60 shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_35px_rgba(139,92,246,0.4)]",
      },
      size: {
        default: "px-7 py-1.5 ",
        sm: "px-4 py-0.5 ",
        lg: "px-10 py-2.5 ",
      },
    },
    defaultVariants: {
      variant: "glass",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  neon?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, neon = true, size, variant = "glass", href, children, onMouseMove, ...props },
    ref
  ) => {
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      e.currentTarget.style.setProperty("--mouse-x", `${x}px`);
      e.currentTarget.style.setProperty("--mouse-y", `${y}px`);
      if (onMouseMove) {
        onMouseMove(e as React.MouseEvent<HTMLButtonElement>);
      }
    };

    const isGlass = variant === "glass";

    const content = (
      <>
        {/* Dynamic mouse-tracking hover bloom for glassy violet effect */}
        {isGlass && (
          <span
            className="pointer-events-none absolute -inset-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
            style={{
              background:
                "radial-gradient(circle 220px at var(--mouse-x, 50%) var(--mouse-y, 50%), #7c3aed 0%, #6366f1 50%, #8b5cf6 100%)",
            }}
          />
        )}

        {/* Top neon glow line */}
        <span
          className={cn(
            "absolute h-px opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out inset-x-0 top-0 bg-gradient-to-r w-3/4 mx-auto from-transparent via-violet-300 to-transparent hidden z-10",
            neon && "block"
          )}
        />

        {/* Button content */}
        <span className="relative z-10 inline-flex items-center justify-center gap-2">
          {children}
        </span>

        {/* Bottom neon glow line */}
        <span
          className={cn(
            "absolute group-hover:opacity-60 transition-all duration-500 ease-in-out inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-cyan-400 to-transparent hidden z-10",
            neon && "block"
          )}
        />
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          onMouseMove={handleMouseMove}
          className={cn(buttonVariants({ variant, size }), className)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        onMouseMove={handleMouseMove}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
