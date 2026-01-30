'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DonationRecord, UserProfile } from '@/lib/types';
import { Heart, Calendar, MapPin } from 'lucide-react';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
};

export default function DonationsPage() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [recipientNames, setRecipientNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      if (!user) return;

      try {
        const donationsRef = collection(db, 'donations');
        const q = query(donationsRef, where('donorId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const allDonations = querySnapshot.docs.map(doc => doc.data() as DonationRecord);
        setDonations(allDonations);

        // Fetch recipient names
        const usersRef = collection(db, 'users');
        const names: Record<string, string> = {};

        for (const donation of allDonations) {
          if (donation.recipientId && !names[donation.recipientId]) {
            const userQuery = query(usersRef, where('id', '==', donation.recipientId));
            const userDocs = await getDocs(userQuery);
            if (!userDocs.empty) {
              const userData = userDocs.docs[0].data() as UserProfile;
              names[donation.recipientId] = userData.name;
            }
          }
        }

        setRecipientNames(names);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading donations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Donations</h1>
        <p className="text-foreground/60 mt-2">
          {donations.length} donation{donations.length !== 1 ? 's' : ''} on record
        </p>
      </div>

      {donations.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No donations yet
            </h3>
            <p className="text-foreground/60">
              Your donation history will appear here once you've made a donation
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {donations.map(donation => (
            <Card key={donation.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {donation.recipientId ? `Donation to ${recipientNames[donation.recipientId] || 'Loading...'}` : 'Blood Bank Donation'}
                    </CardTitle>
                    <CardDescription>
                      {donation.bloodType} - {donation.quantity} units
                    </CardDescription>
                  </div>
                  <Badge className={`${statusColors[donation.status]}`}>
                    {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{new Date(donation.donationDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{donation.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Heart className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
                    <span>{donation.quantity} units donated</span>
                  </div>
                </div>
                {donation.notes && (
                  <div className="mt-4 p-3 bg-secondary/5 rounded border border-border">
                    <p className="text-sm text-foreground/70">{donation.notes}</p>
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
