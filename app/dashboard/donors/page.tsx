'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserProfile } from '@/lib/types';
import { getCompatibleDonors } from '@/lib/bloodCompatibility';
import { Heart, MapPin, Phone, Mail, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function DonorsPage() {
  const { user } = useAuth();
  const [donors, setDonors] = useState<UserProfile[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<UserProfile[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDonors = async () => {
      if (!user) return;

      try {
        // Fetch current user profile
        const usersRef = collection(db, 'users');
        const userQuery = query(usersRef, where('id', '==', user.uid));
        const userDocs = await getDocs(userQuery);
        
        if (!userDocs.empty) {
          const profile = userDocs.docs[0].data() as UserProfile;
          setUserProfile(profile);

          // Get compatible donors
          const compatibleBloodTypes = getCompatibleDonors(profile.bloodType);

          // Fetch all donors
          const donorQuery = query(
            usersRef,
            where('role', '==', 'donor'),
            where('isAvailable', '==', true)
          );
          const donorDocs = await getDocs(donorQuery);

          const allDonors = donorDocs.docs
            .map(doc => doc.data() as UserProfile)
            .filter(donor => compatibleBloodTypes.includes(donor.bloodType) && donor.id !== user.uid);

          setDonors(allDonors);
          setFilteredDonors(allDonors);
        }
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, [user]);

  useEffect(() => {
    const filtered = donors.filter(donor =>
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.bloodType.includes(searchTerm) ||
      donor.college.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDonors(filtered);
  }, [searchTerm, donors]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Find Blood Donors</h1>
          <p className="text-foreground/60 mt-2">
            Compatible donors for {userProfile?.bloodType} blood type
          </p>
        </div>

        <div className="flex gap-4">
          <Input
            placeholder="Search by name, blood type, or college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-border flex-1"
          />
        </div>
      </div>

      {filteredDonors.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No compatible donors found
            </h3>
            <p className="text-foreground/60">
              {searchTerm
                ? 'Try adjusting your search criteria'
                : 'Check back later when more donors register'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map(donor => (
            <Card key={donor.id} className="border-border overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{donor.name}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {donor.bloodType}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-foreground/70">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{donor.college}</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Heart className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{donor.totalDonations} donations</span>
                  </div>
                  <div className="flex items-center gap-3 text-foreground/70">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{donor.phoneNumber}</span>
                  </div>
                  {donor.location.address && (
                    <div className="flex items-center gap-3 text-foreground/70">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{donor.location.address}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex gap-2">
                  <Link href={`/dashboard/messages?userId=${donor.id}`} className="flex-1">
                    <Button variant="outline" className="w-full border-border bg-transparent" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                  </Link>
                  <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    <Heart className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
