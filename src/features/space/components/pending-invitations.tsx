'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { acceptInvitation } from '../actions/accept-invitation.action';
import { rejectInvitation } from '../actions/reject-invitation.action';

interface Invitation {
  id: string;
  space: {
    name: string;
    default_currency: string;
  };
  invitedBy: {
    name: string;
  };
  created_at: string;
}

export function PendingInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    // This would typically be called from a server component
    // For now, we'll leave it as a placeholder
    setLoading(false);
  }, []);

  const handleAccept = async (token: string) => {
    setProcessing(token);
    try {
      const result = await acceptInvitation(token);
      if (result.success) {
        setInvitations(invitations.filter(inv => inv.id !== token));
        // You might want to show a success message or redirect
        window.location.reload();
      }
    } catch (error) {
      console.error('Error accepting invitation:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (token: string) => {
    setProcessing(token);
    try {
      const result = await rejectInvitation(token);
      if (result.success) {
        setInvitations(invitations.filter(inv => inv.id !== token));
      }
    } catch (error) {
      console.error('Error rejecting invitation:', error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <div>Loading invitations...</div>;
  }

  if (invitations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          You have {invitations.length} pending invitation{invitations.length > 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invitations.map((invitation) => (
          <div
            key={invitation.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium">{invitation.space.name}</h4>
                <Badge variant="secondary">{invitation.space.default_currency}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Invited by {invitation.invitedBy.name} •{' '}
                {new Date(invitation.created_at).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => handleAccept(invitation.id)}
                disabled={processing === invitation.id}
              >
                {processing === invitation.id ? 'Accepting...' : 'Accept'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleReject(invitation.id)}
                disabled={processing === invitation.id}
              >
                {processing === invitation.id ? 'Rejecting...' : 'Reject'}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
