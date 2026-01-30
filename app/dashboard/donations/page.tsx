'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  DocumentData,
  QuerySnapshot,
  getDocs,
} from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // ← FIXED: this import was missing
import { DonationRecord } from '@/lib/types';
import { Heart, Calendar, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const statusColors: Record<string, string> = {
  offered: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [recipientNames, setRecipientNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recipient names only when necessary
  const fetchRecipientNames = useCallback(
    async (currentDonations: DonationRecord[]) => {
      if (currentDonations.length === 0) return;

      const usersRef = collection(db, 'users');
      const newNames: Record<string, string> = { ...recipientNames };

      const uniqueIds = new Set<string>(
        currentDonations
          .filter((d) => d.requestId || d.recipientId)
          .map((d) => (d.requestId || d.recipientId)!)
      );

      for (const id of uniqueIds) {
        if (id && !newNames[id]) {
          try {
            const q = query(usersRef, where('uid', '==', id));
            const snap = await getDocs(q);
            if (!snap.empty) {
              const data = snap.docs[0].data();
              newNames[id] = (data.name as string) || 'Unknown';
            }
          } catch (err) {
            console.warn(`Failed to fetch name for user ${id}:`, err);
          }
        }
      }

      setRecipientNames((prev) => ({ ...prev, ...newNames }));
    },
    [recipientNames]
  );

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'donations'),
      where('donorId', '==', user.uid),
      orderBy('offeredAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newDonations = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DonationRecord[];

        setDonations(newDonations);
        setLoading(false);
        setError(null);

        fetchRecipientNames(newDonations);
      },
      (err) => {
        console.error('Donations real-time error:', err);
        setError('Failed to load donations. Please try refreshing.');
        toast.error('Cannot load donation history');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid, fetchRecipientNames]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your donation history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Donations</h1>
          <p className="text-muted-foreground mt-1">
            {donations.length} donation{donations.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
      </div>

      {donations.length === 0 ? (
        <Card className="border-border bg-muted/30">
          <CardContent className="pt-12 pb-12 text-center space-y-4">
            <Heart className="w-16 h-16 text-muted-foreground/50 mx-auto" />
            <h3 className="text-xl font-semibold">No donations yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              When you offer blood to a request, it will appear here with real-time updates.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {donations.map((donation) => (
            <Card key={donation.id} className="border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {donation.requestId || donation.recipientId
                        ? `Donation to ${recipientNames[donation.requestId || donation.recipientId!] || '...'}` 
                        : 'General Blood Donation'}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {donation.bloodType || '—'} • {donation.units ?? donation.quantity ?? '?'} unit
                      {(donation.units ?? donation.quantity ?? 0) !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>

                  <Badge
                    variant="outline"
                    className={statusColors[donation.status ?? 'offered'] || 'bg-gray-100 text-gray-800'}
                  >
                    {(donation.status ?? 'offered').charAt(0).toUpperCase() +
                     (donation.status ?? 'offered').slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-5 text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>
                      {donation.offeredAt || donation.donationDate || donation.createdAt ? (
                        (() => {
                          let dateValue = donation.offeredAt || donation.donationDate || donation.createdAt;
                          // Handle Firestore Timestamp
                          if (dateValue?.toDate) dateValue = dateValue.toDate();
                          // Handle string or Date
                          const parsed = new Date(dateValue);
                          return isNaN(parsed.getTime())
                            ? '—'
                            : parsed.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              });
                        })()
                      ) : (
                        '—'
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{donation.location || 'Not specified'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Heart className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
                    <span>
                      {donation.units ?? donation.quantity ?? '?'} unit
                      {(donation.units ?? donation.quantity ?? 0) !== 1 ? 's' : ''} donated
                    </span>
                  </div>
                </div>

                {donation.notes && (
                  <div className="mt-3 p-3 bg-muted/40 rounded-md border border-border text-sm text-muted-foreground">
                    {donation.notes}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}