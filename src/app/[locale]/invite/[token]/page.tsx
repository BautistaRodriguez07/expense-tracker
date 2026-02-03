import { acceptInvitation, acceptInvitationWithoutAuth } from '@/features/space/actions/accept-invitation.action';
import { rejectInvitation } from '@/features/space/actions/reject-invitation.action';
import { validateAuth } from '@/features/auth/services/auth.service';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface InvitePageProps {
  params: {
    token: string;
  };
  searchParams: {
    email?: string;
  };
}

export default async function InvitePage({ params, searchParams }: InvitePageProps) {
  const { token } = params;
  const { email } = searchParams;

  try {
    // Check if user is authenticated
    const auth = await validateAuth();

    if (auth) {
      // User is logged in, try to accept the invitation directly
      const result = await acceptInvitation(token);
      
      if (result.success) {
        redirect('/settings?message=invitation-accepted');
      } else {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Invitation Error</CardTitle>
                <CardDescription>
                  {result.error}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/settings">
                  <Button className="w-full">Go to Settings</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
      }
    } else {
      // User is not logged in, verify the invitation exists
      if (!email) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Email Required</CardTitle>
                <CardDescription>
                  Please check your invitation email for the complete link.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/sign-in">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
      }

      const result = await acceptInvitationWithoutAuth(token, email);
      
      if (!result.success) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600">Invalid Invitation</CardTitle>
                <CardDescription>
                  {result.error}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/sign-in">
                  <Button className="w-full">Sign In</Button>
                </Link>
              </CardContent>
            </Card>
          );
      }

      const invitation = result.data;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">You're Invited! 🎉</CardTitle>
              <CardDescription>
                You've been invited to join <strong>{invitation.space.name}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Invited by <strong>{invitation.invitedBy.name}</strong>
                </p>
                <div className="flex justify-center">
                  <Badge variant="secondary">
                    {invitation.space.default_currency}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600 text-center">
                  Do you have an account?
                </p>
                <div className="space-y-2">
                  <Link href={`/sign-in?callbackUrl=/invite/${token}&email=${encodeURIComponent(email)}`}>
                    <Button className="w-full" variant="default">
                      Sign In to Accept
                    </Button>
                  </Link>
                  <Link href={`/sign-up?callbackUrl=/invite/${token}&email=${encodeURIComponent(email)}`}>
                    <Button className="w-full" variant="outline">
                      Create Account
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <form action={async () => {
                  'use server';
                  await rejectInvitation(token);
                  redirect('/sign-in?message=invitation-rejected');
                }}>
                  <Button type="submit" variant="ghost" size="sm">
                    Decline Invitation
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
  } catch (error) {
    console.error('Invitation page error:', error);
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Invitation Error</CardTitle>
            <CardDescription>
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button className="w-full">Go to Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }
}
