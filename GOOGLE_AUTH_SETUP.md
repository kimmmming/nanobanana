# Google OAuth Setup with Supabase

This guide explains how to configure Google OAuth authentication for the Nano Banana application.

## Prerequisites

1. A Supabase project (create one at [supabase.com](https://supabase.com))
2. A Google Cloud project with OAuth 2.0 credentials

## Step 1: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Add authorized redirect URIs:
   - For development: `http://localhost:3000/auth/callback`
   - For production: `https://your-domain.com/auth/callback`
   - **Important**: Also add your Supabase callback URL: `https://<your-project-ref>.supabase.co/auth/v1/callback`
7. Save your **Client ID** and **Client Secret**

## Step 2: Configure Supabase

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** > **Providers**
4. Find **Google** in the list and enable it
5. Enter your Google **Client ID** and **Client Secret**
6. Save the configuration

## Step 3: Set Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

   You can find these values in your Supabase project settings:
   - Go to **Settings** > **API**
   - Copy the **Project URL** and **anon/public** key

## Step 4: Test the Integration

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)
3. Click the **Sign in with Google** button in the header
4. Complete the Google OAuth flow
5. You should be redirected back to the homepage after successful authentication

## Architecture

The implementation uses server-side authentication with the following components:

- **Client utilities** (`lib/supabase/client.ts`): Browser-side Supabase client
- **Server utilities** (`lib/supabase/server.ts`): Server-side Supabase client with cookie handling
- **Auth callback** (`app/auth/callback/route.ts`): Handles OAuth callback and session exchange
- **Google Sign-In Button** (`components/auth/google-signin-button.tsx`): UI component for initiating OAuth flow

## Troubleshooting

### Redirect URI mismatch error
- Ensure the redirect URI in Google Cloud Console matches exactly: `https://<your-project-ref>.supabase.co/auth/v1/callback`
- Also add your application's callback URL: `http://localhost:3000/auth/callback` (development) or `https://your-domain.com/auth/callback` (production)

### Environment variables not loading
- Restart the development server after updating `.env.local`
- Ensure variable names start with `NEXT_PUBLIC_` for client-side access

### Session not persisting
- Check that cookies are enabled in your browser
- Verify that the Supabase URL and anon key are correct
