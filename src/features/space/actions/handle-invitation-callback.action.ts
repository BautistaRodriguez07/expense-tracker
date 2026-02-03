'use server';

import { acceptInvitation } from './accept-invitation.action';
import { validateAuth } from '@/features/auth/services/auth.service';
import { redirect } from 'next/navigation';

export async function handleInvitationCallback(token: string) {
  const auth = await validateAuth();
  if (!auth) {
    redirect(`/sign-in?callbackUrl=/invite/${token}`);
  }

  try {
    const result = await acceptInvitation(token);
    
    if (result.success) {
      redirect('/settings?message=invitation-accepted');
    } else {
      redirect(`/settings?error=${encodeURIComponent(result.error || 'Failed to accept invitation')}`);
    }
  } catch (error) {
    console.error('Error handling invitation callback:', error);
    redirect('/settings?error=Failed to process invitation');
  }
}
