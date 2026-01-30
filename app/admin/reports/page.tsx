'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileDown, Calendar } from 'lucide-react';

const reports = [
  { id: '1', name: 'Monthly Activity Report', date: 'Jun 2024', type: 'PDF', size: '2.4 MB' },
  { id: '2', name: 'User Demographics', date: 'Jun 2024', type: 'PDF', size: '1.8 MB' },
  { id: '3', name: 'Blood Donation Statistics', date: 'Jun 2024', type: 'Excel', size: '856 KB' },
  { id: '4', name: 'Matching Algorithm Performance', date: 'May 2024', type: 'PDF', size: '1.2 MB' },
];

export default function AdminReportsPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Reports</h1>
        <p className="text-foreground/60 mt-2">Generate and download system reports</p>
      </div>

      {/* Generate New Report */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Generate New Report</CardTitle>
          <CardDescription>Create a custom report based on date range and metrics</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Report Type</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>Activity Report</option>
                <option>User Analytics</option>
                <option>Blood Statistics</option>
                <option>Financial Report</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Date Range</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last quarter</option>
                <option>Last year</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Format</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                <option>PDF</option>
                <option>Excel</option>
                <option>CSV</option>
              </select>
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <FileDown className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Previously generated reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports.map(report => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-secondary/5 transition-colors">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{report.name}</h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-foreground/60">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {report.date}
                    </span>
                    <Badge variant="outline">{report.type}</Badge>
                    <span>{report.size}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="border-border bg-transparent">
                  <FileDown className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
