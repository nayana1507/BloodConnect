'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/lib/types';
import { Heart, Droplet, Users, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserProfile(docSnap.data() as UserProfile);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome, {userProfile?.name}
        </h1>
        <p className="text-foreground/60">
          Blood Type: <span className="font-semibold text-primary text-lg">{userProfile?.bloodType}</span>
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userProfile?.totalDonations || 0}
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              Lives saved
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="w-4 h-4 text-primary" />
              Blood Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userProfile?.isAvailable ? 'Available' : 'Unavailable'}
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              {userProfile?.isAvailable ? 'Ready to donate' : 'Not available'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              Last Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {userProfile?.lastDonationDate ? new Date(userProfile.lastDonationDate).toLocaleDateString() : 'Never'}
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              Donation history
            </p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground capitalize">
              {userProfile?.role}
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              Account type
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Find Donors</CardTitle>
            <CardDescription>
              {userProfile?.role === 'recipient'
                ? 'Find compatible blood donors'
                : 'View other donors in your area'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/donors">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Donors
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Blood Requests</CardTitle>
            <CardDescription>
              {userProfile?.role === 'recipient'
                ? 'Create or manage requests'
                : 'View urgent blood requests'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/requests">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                View Requests
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>
              Stay connected with donors/recipients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/messages">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Open Chat
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Availability Status */}
      {userProfile?.role === 'donor' && (
        <Card className="border-border bg-secondary/5">
          <CardHeader>
            <CardTitle className="text-lg">Donation Availability</CardTitle>
            <CardDescription>
              Toggle your availability to help those in need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">
                  {userProfile.isAvailable ? 'You are available to donate' : 'You are currently unavailable'}
                </p>
                <p className="text-sm text-foreground/60 mt-1">
                  {userProfile.isAvailable
                    ? 'Recipients in need can contact you about blood donations'
                    : 'Update your profile when you are ready to donate'}
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button variant="outline" className="border-border bg-transparent">
                  Update Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
