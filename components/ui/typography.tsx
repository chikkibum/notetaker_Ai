import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Base typography variants
const typographyVariants = cva("", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
      "5xl": "text-5xl",
      "6xl": "text-6xl",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
      black: "font-black",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      accent: "text-accent-foreground",
      mutedForeground: "text-muted-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
      wider: "tracking-wider",
      widest: "tracking-widest",
    },
  },
});

// Heading variants
const headingVariants = cva("scroll-m-20", {
  variants: {
    size: {
      sm: "text-2xl",
      md: "text-3xl",
      lg: "text-4xl",
      xl: "text-5xl",
      "2xl": "text-6xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
    tracking: {
      tighter: "tracking-tighter",
      tight: "tracking-tight",
      normal: "tracking-normal",
      wide: "tracking-wide",
    },
  },
  defaultVariants: {
    tracking: "tight",
  },
});

// Paragraph variants
const paragraphVariants = cva("leading-7", {
  variants: {
    size: {
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      secondary: "text-secondary-foreground",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
  },
});

// Code variants
const codeVariants = cva("relative rounded-sm font-mono", {
  variants: {
    variant: {
      inline: "bg-muted px-[0.3rem] py-[0.2rem] text-sm font-semibold",
      block: "bg-muted p-4 text-sm font-semibold overflow-x-auto",
    },
    size: {
      sm: "text-xs",
      base: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "inline",
    size: "base",
  },
});

// Typography component props type
type TypographyProps<T extends React.ElementType> = {
  as?: T;
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<T> &
  VariantProps<typeof typographyVariants>;

// Heading component props type
type HeadingProps<T extends React.ElementType> = {
  as?: T;
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<T> &
  VariantProps<typeof headingVariants>;

// Paragraph component props type
type ParagraphProps<T extends React.ElementType> = {
  as?: T;
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<T> &
  VariantProps<typeof paragraphVariants>;

// Code component props type
type CodeProps<T extends React.ElementType> = {
  as?: T;
  asChild?: boolean;
} & React.ComponentPropsWithoutRef<T> &
  VariantProps<typeof codeVariants>;

// Generic Typography component
const Typography = React.forwardRef<
  HTMLDivElement,
  TypographyProps<"div"> & { asChild?: boolean }
>(({ className, size, weight, color, align, tracking, asChild, ...props }, ref) => {
  const Comp = asChild ? Slot : "div";
  return (
    <Comp
      ref={ref}
      className={cn(
        typographyVariants({ size, weight, color, align, tracking }),
        className
      )}
      {...props}
    />
  );
});
Typography.displayName = "Typography";

// H1 Component
const H1 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<"h1"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "xl",
      weight = "extrabold",
      color,
      align,
      tracking,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "h1";
    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ size, weight, color, align, tracking }),
          "lg:text-5xl",
          className
        )}
        {...props}
      />
    );
  }
);
H1.displayName = "H1";

// H2 Component
const H2 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<"h2"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "md",
      weight = "semibold",
      color,
      align,
      tracking,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "h2";
    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ size, weight, color, align, tracking }),
          "border-b py-2 first:mt-0",
          className
        )}
        {...props}
      />
    );
  }
);
H2.displayName = "H2";

// H3 Component
const H3 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<"h3"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "lg",
      weight = "semibold",
      color,
      align,
      tracking,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "h3";
    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ size, weight, color, align, tracking }),
          className
        )}
        {...props}
      />
    );
  }
);
H3.displayName = "H3";

// H4 Component
const H4 = React.forwardRef<
  HTMLHeadingElement,
  HeadingProps<"h4"> & { asChild?: boolean }
>(
  (
    {
      className,
      size,
      weight = "semibold",
      color,
      align,
      tracking,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "h4";
    return (
      <Comp
        ref={ref}
        className={cn(
          headingVariants({ size: size || "sm", weight, color, align, tracking }),
          "text-xl",
          className
        )}
        {...props}
      />
    );
  }
);
H4.displayName = "H4";

// Lead Component (large paragraph)
const Lead = React.forwardRef<
  HTMLParagraphElement,
  ParagraphProps<"p"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "xl",
      weight = "normal",
      color = "muted",
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(
          paragraphVariants({ size, weight, color, align }),
          className
        )}
        {...props}
      />
    );
  }
);
Lead.displayName = "Lead";

// P Component (paragraph)
const P = React.forwardRef<
  HTMLParagraphElement,
  ParagraphProps<"p"> & { asChild?: boolean }
>(
  (
    {
      className,
      size,
      weight,
      color,
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(
          paragraphVariants({ size, weight, color, align }),
          "not-first:mt-6",
          className
        )}
        {...props}
      />
    );
  }
);
P.displayName = "P";

// Large Component
const Large = React.forwardRef<
  HTMLDivElement,
  TypographyProps<"div"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "lg",
      weight = "semibold",
      color,
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ size, weight, color, align }),
          className
        )}
        {...props}
      />
    );
  }
);
Large.displayName = "Large";

// Small Component
const Small = React.forwardRef<
  HTMLParagraphElement,
  TypographyProps<"p"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "sm",
      weight = "medium",
      color,
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "p";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ size, weight, color, align }),
          "leading-none",
          className
        )}
        {...props}
      />
    );
  }
);
Small.displayName = "Small";

// Muted Component
const Muted = React.forwardRef<
  HTMLSpanElement,
  TypographyProps<"span"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "sm",
      weight = "normal",
      color = "muted",
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "span";
    return (
      <Comp
        ref={ref}
        className={cn(
          typographyVariants({ size, weight, color, align }),
          className
        )}
        {...props}
      />
    );
  }
);
Muted.displayName = "Muted";

// InlineCode Component
const InlineCode = React.forwardRef<
  HTMLElement,
  CodeProps<"code"> & { asChild?: boolean }
>(
  (
    {
      className,
      variant = "inline",
      size,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "code";
    return (
      <Comp
        ref={ref}
        className={cn(codeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
InlineCode.displayName = "InlineCode";

// MultilineCode Component
const MultilineCode = React.forwardRef<
  HTMLPreElement,
  CodeProps<"pre"> & { asChild?: boolean }
>(
  (
    {
      className,
      variant = "block",
      size,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "pre";
    return (
      <Comp
        ref={ref}
        className={cn(codeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
MultilineCode.displayName = "MultilineCode";

// List Component
const List = React.forwardRef<
  HTMLUListElement,
  TypographyProps<"ul"> & { asChild?: boolean }
>(
  (
    {
      className,
      color,
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "ul";
    return (
      <Comp
        ref={ref}
        className={cn(
          "my-6 ml-6 list-disc [&>li]:mt-2",
          typographyVariants({ color, align }),
          className
        )}
        {...props}
      />
    );
  }
);
List.displayName = "List";

// Quote Component
const Quote = React.forwardRef<
  HTMLQuoteElement,
  TypographyProps<"blockquote"> & { asChild?: boolean }
>(
  (
    {
      className,
      size = "base",
      weight = "normal",
      color = "muted",
      align,
      asChild,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "blockquote";
    return (
      <Comp
        ref={ref}
        className={cn(
          "mt-6 border-l-2 pl-6 italic",
          typographyVariants({ size, weight, color, align }),
          className
        )}
        {...props}
      />
    );
  }
);
Quote.displayName = "Quote";

export {
  Typography,
  H1,
  H2,
  H3,
  H4,
  Lead,
  P,
  Large,
  Small,
  Muted,
  InlineCode,
  MultilineCode,
  List,
  Quote,
  typographyVariants,
  headingVariants,
  paragraphVariants,
  codeVariants,
};

export type {
  TypographyProps,
  HeadingProps,
  ParagraphProps,
  CodeProps,
};
