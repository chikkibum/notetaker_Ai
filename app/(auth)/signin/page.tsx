import { SignupForm } from "@/components/signup-form"

// Force static generation
export const dynamic = 'force-static'

export default function SignupPage() {
  return (
    <div className="bg-muted flex min-h-svh overflow-hidden flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  )
}
