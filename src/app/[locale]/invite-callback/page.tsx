import { handleInvitationCallback } from '@/features/space/actions/handle-invitation-callback.action';
import { redirect } from 'next/navigation';

interface InviteCallbackPageProps {
  searchParams: {
    token?: string;
    callbackUrl?: string;
  };
}

export default async function InviteCallbackPage({ searchParams }: InviteCallbackPageProps) {
  const { token, callbackUrl } = searchParams;

  if (!token) {
    redirect('/settings?error=Missing invitation token');
  }

  // Handle the invitation and redirect appropriately
  await handleInvitationCallback(token);

  // This should never be reached due to redirects in handleInvitationCallback
  redirect(callbackUrl || '/settings');
}
