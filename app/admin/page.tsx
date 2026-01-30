'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Droplet, Heart, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const donationTrendData = [
  { month: 'Jan', donations: 45, requests: 28 },
  { month: 'Feb', donations: 52, requests: 35 },
  { month: 'Mar', donations: 48, requests: 32 },
  { month: 'Apr', donations: 61, requests: 45 },
  { month: 'May', donations: 55, requests: 38 },
  { month: 'Jun', donations: 67, requests: 48 },
];

const bloodTypeDistribution = [
  { name: 'O+', value: 35, fill: '#ef4444' },
  { name: 'A+', value: 25, fill: '#f97316' },
  { name: 'B+', value: 20, fill: '#eab308' },
  { name: 'AB+', value: 15, fill: '#22c55e' },
  { name: 'Other', value: 5, fill: '#0ea5e9' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalRecipients: 0,
    totalDonations: 0,
    totalRequests: 0,
    successRate: 94.2,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const usersRef = collection(db, 'users');
        
        // Get donors
        const donorsQuery = query(usersRef, where('role', '==', 'donor'));
        const donorDocs = await getDocs(donorsQuery);
        
        // Get recipients
        const recipientsQuery = query(usersRef, where('role', '==', 'recipient'));
        const recipientDocs = await getDocs(recipientsQuery);

        // Get donations
        const donationsRef = collection(db, 'donations');
        const donationDocs = await getDocs(donationsRef);

        // Get blood requests
        const requestsRef = collection(db, 'bloodRequests');
        const requestDocs = await getDocs(requestsRef);

        setStats({
          totalDonors: donorDocs.size,
          totalRecipients: recipientDocs.size,
          totalDonations: donationDocs.size,
          totalRequests: requestDocs.size,
          successRate: 94.2,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-foreground/60">System overview and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Total Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalDonors}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Active accounts</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Total Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalRecipients}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Registered users</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplet className="w-4 h-4 text-primary" />
              Total Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalDonations}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Recorded</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-primary" />
              Blood Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.totalRequests}</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Active</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.successRate.toFixed(1)}%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Match rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Donation & Request Trends</CardTitle>
            <CardDescription>Monthly activity comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={donationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="donations" fill="#ef4444" />
                <Bar dataKey="requests" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Blood Type Distribution</CardTitle>
            <CardDescription>Current inventory</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodTypeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Manage Users</CardTitle>
            <CardDescription>View and manage all users</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/users">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Users
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Blood Inventory</CardTitle>
            <CardDescription>Manage blood stock</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/inventory">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Manage Inventory
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Reports</CardTitle>
            <CardDescription>Generate system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin/reports">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
