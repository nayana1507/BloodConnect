'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const recentRequests = [
  { id: '1', bloodType: 'A+', quantity: 4, urgency: 'high', status: 'matched', matchedDonors: 3 },
  { id: '2', bloodType: 'O-', quantity: 2, urgency: 'critical', status: 'matched', matchedDonors: 5 },
  { id: '3', bloodType: 'B+', quantity: 3, urgency: 'medium', status: 'open', matchedDonors: 1 },
  { id: '4', bloodType: 'AB+', quantity: 1, urgency: 'low', status: 'completed', matchedDonors: 1 },
];

const urgencyColors = {
  low: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900',
};

const statusColors = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900',
  matched: 'bg-blue-100 text-blue-800 dark:bg-blue-900',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900',
};

export default function AdminRequestsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blood Requests</h1>
          <p className="text-foreground/60 mt-2">Monitor and manage blood requests</p>
        </div>

        <Input
          placeholder="Search by blood type, ID, or recipient..."
          className="border-border max-w-md"
        />
      </div>

      {/* Requests Table */}
      <Card className="border-border overflow-hidden">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
          <CardDescription>{recentRequests.length} total requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Request ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Blood Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Quantity</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Urgency</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Matched Donors</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map(request => (
                  <tr key={request.id} className="border-b border-border hover:bg-secondary/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-foreground text-xs">#{request.id}</td>
                    <td className="py-3 px-4">
                      <Badge className="bg-primary/20 text-primary border-primary/30">
                        {request.bloodType}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">{request.quantity} units</td>
                    <td className="py-3 px-4">
                      <Badge className={urgencyColors[request.urgency as keyof typeof urgencyColors]}>
                        {request.urgency}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={statusColors[request.status as keyof typeof statusColors]}>
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-foreground">{request.matchedDonors}</td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
