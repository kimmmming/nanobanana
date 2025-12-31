'use client'

import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export function GoogleSignInButton() {
  const isConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-project-url'

  const handleSignIn = async () => {
    if (!isConfigured) {
      alert('Supabase is not configured. Please set up your environment variables.')
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error('Error signing in:', error.message)
    }
  }

  return (
    <Button
      onClick={handleSignIn}
      className="bg-banana text-banana-foreground hover:bg-banana/90"
    >
      Sign in with Google
    </Button>
  )
}
