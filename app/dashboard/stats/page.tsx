'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, Users, Droplet, TrendingUp } from 'lucide-react';

const donationTrendData = [
  { month: 'Jan', donations: 4 },
  { month: 'Feb', donations: 3 },
  { month: 'Mar', donations: 2 },
  { month: 'Apr', donations: 5 },
  { month: 'May', donations: 4 },
  { month: 'Jun', donations: 6 },
];

const bloodTypeData = [
  { name: 'O+', value: 35, fill: '#ef4444' },
  { name: 'A+', value: 25, fill: '#f97316' },
  { name: 'B+', value: 20, fill: '#eab308' },
  { name: 'AB+', value: 15, fill: '#22c55e' },
  { name: 'O-', value: 3, fill: '#0ea5e9' },
  { name: 'A-', value: 1, fill: '#6366f1' },
  { name: 'B-', value: 1, fill: '#d946ef' },
];

const requestsData = [
  { month: 'Jan', requests: 2, fulfilled: 1 },
  { month: 'Feb', requests: 3, fulfilled: 2 },
  { month: 'Mar', requests: 1, fulfilled: 1 },
  { month: 'Apr', requests: 4, fulfilled: 3 },
  { month: 'May', requests: 3, fulfilled: 2 },
  { month: 'Jun', requests: 5, fulfilled: 4 },
];

export default function StatsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistics & Analytics</h1>
        <p className="text-foreground/60 mt-2">View donation trends and community insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" />
              Total Donors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1,234</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Active Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">342</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">+8% from last month</p>
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
            <div className="text-3xl font-bold text-foreground">5,678</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">+15% from last month</p>
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
            <div className="text-3xl font-bold text-foreground">94.2%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Matched requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation activity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={donationTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="donations" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Blood Type Distribution</CardTitle>
            <CardDescription>Current inventory by blood type</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bloodTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bloodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle>Requests & Fulfillment</CardTitle>
            <CardDescription>Blood requests and successful matches</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={requestsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="requests" fill="#f97316" />
                <Bar dataKey="fulfilled" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
