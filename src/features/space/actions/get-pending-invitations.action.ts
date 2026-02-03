'use server';

import { InvitationService } from '../services/invitation.service';
import { validateAuth } from '@/features/auth/services/auth.service';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export const getPendingInvitations = cache(async () => {
  const auth = await validateAuth();
  if (!auth) redirect('/sign-in');

  try {
    // Get email from user
    const userEmail = auth.dbUser.email;
    if (!userEmail) {
      return {
        success: false,
        error: 'User email not found',
      };
    }

    const invitations = await InvitationService.getPendingInvitationsForUser(userEmail);
    
    return {
      success: true,
      data: invitations,
    };
  } catch (error) {
    console.error('Failed to get pending invitations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get pending invitations',
    };
  }
});

export const getSpaceInvitations = cache(async (spaceId: string) => {
  const auth = await validateAuth();
  if (!auth) redirect('/sign-in');

  try {
    const invitations = await InvitationService.getSpaceInvitations(spaceId, auth.dbUser.id);
    
    return {
      success: true,
      data: invitations,
    };
  } catch (error) {
    console.error('Failed to get space invitations:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get space invitations',
    };
  }
});
