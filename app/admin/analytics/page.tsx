'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';

const monthlyData = [
  { month: 'Jan', donors: 120, recipients: 45, donations: 65, requests: 42 },
  { month: 'Feb', donors: 135, recipients: 52, donations: 72, requests: 48 },
  { month: 'Mar', donors: 142, recipients: 58, donations: 68, requests: 52 },
  { month: 'Apr', donors: 168, recipients: 65, donations: 85, requests: 61 },
  { month: 'May', donors: 185, recipients: 72, donations: 92, requests: 68 },
  { month: 'Jun', donors: 210, recipients: 85, donations: 105, requests: 78 },
];

const dailyActivityData = [
  { day: 'Mon', activity: 85 },
  { day: 'Tue', activity: 92 },
  { day: 'Wed', activity: 78 },
  { day: 'Thu', activity: 110 },
  { day: 'Fri', activity: 95 },
  { day: 'Sat', activity: 105 },
  { day: 'Sun', activity: 88 },
];

const matchingRateData = [
  { month: 'Jan', matchRate: 82 },
  { month: 'Feb', matchRate: 85 },
  { month: 'Mar', matchRate: 88 },
  { month: 'Apr', matchRate: 91 },
  { month: 'May', matchRate: 93 },
  { month: 'Jun', matchRate: 94 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-foreground/60 mt-2">Platform performance and user metrics</p>
      </div>

      {/* Monthly Comparison */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Monthly Growth</CardTitle>
          <CardDescription>Users, donations, and requests over time</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="donors" fill="#ef4444" />
              <Bar dataKey="recipients" fill="#0ea5e9" />
              <Bar dataKey="donations" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Activity */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Daily Activity</CardTitle>
            <CardDescription>Platform usage by day of week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={dailyActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="activity" fill="#ef4444" stroke="#ef4444" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Matching Rate Trend */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Matching Success Rate</CardTitle>
            <CardDescription>% of fulfilled blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={matchingRateData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="matchRate" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Avg. Response Time</CardTitle>
            <CardDescription>Time to match blood requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">2.4 hrs</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Improved by 15%</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">User Retention</CardTitle>
            <CardDescription>Active users this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">87%</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Stable engagement</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Avg. Donations/Month</CardTitle>
            <CardDescription>Per active donor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">1.8</div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-2">Community engaged</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
