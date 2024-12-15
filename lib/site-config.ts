export interface PricingPlan {
  name: string
  price?: string
  monthlyPrice?: number
  annualPrice?: number
  description: string
  features: string[]
  popular: boolean
  cta: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface Testimonial {
  name: string
  username: string
  body: string
  img: string
}

export interface Feature {
  title: string
  description: string
  type?: "cli" | "global" | "smart" | "dynamic"
}

export interface FooterLink {
  label: string
  href?: string
}

export interface SiteConfig {
  hero: {
    badge: {
      text: string
      icon?: string
    }
    title: string
    description: string
    cta: {
      text: string
      href: string
    }
    socialProof: {
      text: string
      companies: Array<{
        name: string
        logo?: string
        svg?: string
      }>
    }
  }
  features: {
    title: string
    features: Feature[]
  }
  pricing: {
    badge: {
      text: string
      icon?: string
    }
    title: string
    description: string
    plans: PricingPlan[]
    bottomCta: {
      text: string
      contactText: string
    }
    annualSavings: {
      text: string
      percentage: number
    }
  }
  testimonials: {
    badge: {
      text: string
    }
    title: string
    description: string
    testimonials: Testimonial[]
    cta: {
      text: string
    }
  }
  newReleasePromo: {
    title: string
    subtitle: string
    cta: {
      text: string
      href: string
    }
    wordmark: string
  }
  faq: {
    badge: {
      text: string
      icon?: string
    }
    title: string
    faqs: FAQ[]
  }
  stickyFooter: {
    brand: string
    links: {
      column1: FooterLink[]
      column2: FooterLink[]
    }
  }
}

export const siteConfig: SiteConfig = {
  hero: {
    badge: {
      text: "Latest component",
      icon: "Sparkles",
    },
    title: "Reach developers & creators effortlessly",
    description:
      "Beautiful, accessible components built with Tailwind CSS and Framer Motion. Copy, paste, and customize to build your next project faster.",
    cta: {
      text: "Get started",
      href: "/docs/components/theme-toggle-animations",
    },
    socialProof: {
      text: "Trusted by developers at",
      companies: [
        {
          name: "Vercel",
          svg: "vercel",
        },
        {
          name: "Tailwind CSS",
          logo: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tailwind_CSS_Logo.svg-6xxjTKleFAC9zoBBGesuy0rIESAcXA.png",
        },
        {
          name: "Framer",
          svg: "framer",
        },
        {
          name: "Next.js",
          svg: "nextjs",
        },
      ],
    },
  },
  features: {
    title: "Features",
    features: [
      {
        title: "CLI & Manual Support",
        description: "Integrate your landing page directly in the product while using your favorite tools.",
        type: "cli",
      },
      {
        title: "Globally Usable",
        description:
          "Blocks are available everywhere but ours are the best. Use them in your favorite framework or even in plain HTML.",
        type: "global",
      },
      {
        title: "Smart Components",
        description: "Intelligent components that adapt to your needs with built-in animations and interactions.",
        type: "smart",
      },
      {
        title: "Dynamic Layouts",
        description: "Responsive layouts that transform and adapt seamlessly across all device sizes.",
        type: "dynamic",
      },
    ],
  },
  pricing: {
    badge: {
      text: "Pricing",
      icon: "Sparkles",
    },
    title: "Choose your plan",
    description: "Start building beautiful components today. Upgrade anytime as your needs grow.",
    plans: [
      {
        name: "Starter",
        price: "Free",
        description: "Perfect for getting started with v0",
        features: ["5 components per month", "Basic templates", "Community support", "Standard components"],
        popular: false,
        cta: "Get Started",
      },
      {
        name: "Pro",
        monthlyPrice: 29,
        annualPrice: 24,
        description: "For professionals building serious projects",
        features: [
          "Unlimited components",
          "Premium templates",
          "Priority support",
          "Advanced animations",
          "Custom themes",
          "Export to GitHub",
        ],
        popular: true,
        cta: "Start Free Trial",
      },
      {
        name: "Team",
        monthlyPrice: 99,
        annualPrice: 79,
        description: "For teams collaborating on projects",
        features: [
          "Everything in Pro",
          "Team collaboration",
          "Shared component library",
          "Advanced analytics",
          "Custom integrations",
          "Dedicated support",
        ],
        popular: false,
        cta: "Contact Sales",
      },
    ],
    bottomCta: {
      text: "Need a custom solution? We're here to help.",
      contactText: "Contact our sales team →",
    },
    annualSavings: {
      text: "Save 20%",
      percentage: 20,
    },
  },
  testimonials: {
    badge: {
      text: "Testimonials",
    },
    title: "What our users say",
    description:
      "From intuitive design to powerful features, our app has become an essential tool for users around the world.",
    testimonials: [
      {
        name: "Arjun Mehta",
        username: "@arjdev",
        body: "v0 has completely changed the way I build UIs. Generate, copy-paste, done. No more design stress.",
        img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Sara Lin",
        username: "@sara.codes",
        body: "Honestly shocked at how smooth the v0 generated components are out of the box. Just works perfectly.",
        img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Devon Carter",
        username: "@devninja",
        body: "Our team launched a client site in 2 days using v0 components. Saved so much development time.",
        img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Priya Shah",
        username: "@priyacodes",
        body: "Generated a few components in v0 and everything blended perfectly with our codebase. Massive W.",
        img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Leo Martin",
        username: "@leobuilds",
        body: "Found a beautiful hero section in v0, tweaked the prompt, and shipped in 15 minutes. Game changer.",
        img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Chloe Winters",
        username: "@chloewinters",
        body: "v0 helped us prototype multiple landing pages without writing CSS once. Pure magic.",
        img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Ayaan Malik",
        username: "@ayaan_dev",
        body: "As a solo founder, v0 lets me move fast without sacrificing design quality. Essential tool.",
        img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "Monica Reeves",
        username: "@monicareeves",
        body: "Can't believe how polished the v0 generated components look. Clients are impressed every time.",
        img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      },
      {
        name: "James Roy",
        username: "@jamesrdev",
        body: "v0 is a lifesaver when deadlines are tight. Generate a component, tweak, and deploy instantly.",
        img: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
      },
    ],
    cta: {
      text: "Share your experience",
    },
  },
  newReleasePromo: {
    title: "Build. Customize. Deploy Quickly.",
    subtitle: "Built to keep you hooked.",
    cta: {
      text: "Get started",
      href: "/docs/get-started",
    },
    wordmark: "skiper/ui",
  },
  faq: {
    badge: {
      text: "Faqs",
      icon: "✶",
    },
    title: "Questions? We've got answers",
    faqs: [
      {
        question: "What is v0 exactly?",
        answer:
          "v0 is an AI-powered generative user interface system that helps you build React components using simple text prompts. It generates clean, production-ready code that you can copy and customize for your projects.",
      },
      {
        question: "Do I need to know Tailwind to use it?",
        answer:
          "While basic knowledge of Tailwind CSS is helpful, it's not required. v0 generates components with Tailwind classes, and you can learn as you go. The generated code is clean and well-structured, making it easy to understand and modify.",
      },
      {
        question: "Can I use these components commercially?",
        answer:
          "Yes! All components generated by v0 can be used in commercial projects. You own the code that's generated, and there are no licensing restrictions on using it in your applications.",
      },
      {
        question: "Are the components responsive and accessible?",
        answer:
          "Absolutely. v0 generates components that are responsive by default and follow accessibility best practices. All components include proper ARIA attributes, keyboard navigation, and semantic HTML structure.",
      },
      {
        question: "How do I integrate a component into my project?",
        answer:
          "Simply copy the generated code and paste it into your React project. v0 provides installation instructions for any required dependencies, and the components are designed to work seamlessly with modern React frameworks like Next.js.",
      },
    ],
  },
  stickyFooter: {
    brand: "v0",
    links: {
      column1: [
        {
          label: "Home",
        },
        {
          label: "Docs",
        },
        {
          label: "Components",
        },
      ],
      column2: [
        {
          label: "Github",
        },
        {
          label: "Twitter",
        },
        {
          label: "Discord",
        },
      ],
    },
  },
}
