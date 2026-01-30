'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Droplet, AlertTriangle } from 'lucide-react';

const bloodInventory = [
  { type: 'O-', units: 8, status: 'low' },
  { type: 'O+', units: 24, status: 'normal' },
  { type: 'A-', units: 6, status: 'low' },
  { type: 'A+', units: 18, status: 'normal' },
  { type: 'B-', units: 4, status: 'critical' },
  { type: 'B+', units: 14, status: 'normal' },
  { type: 'AB-', units: 2, status: 'critical' },
  { type: 'AB+', units: 9, status: 'low' },
];

export default function AdminInventoryPage() {
  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Blood Inventory</h1>
        <p className="text-foreground/60 mt-2">Manage blood stock and availability</p>
      </div>

      {/* Inventory Overview */}
      <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-4">
        {bloodInventory.map(item => (
          <Card key={item.type} className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>{item.type}</span>
                <Droplet className="w-4 h-4 text-primary fill-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{item.units}</div>
              <p className="text-xs text-foreground/60 mt-1">units</p>
              <Badge 
                className={`mt-2 text-xs ${
                  item.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900' :
                  item.status === 'low' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900' :
                  'bg-green-100 text-green-800 dark:bg-green-900'
                }`}
              >
                {item.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert */}
      <Card className="border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Low Stock Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground/70 mb-4">
            The following blood types are running low and need immediate restocking:
          </p>
          <div className="space-y-2">
            {bloodInventory.filter(item => item.status !== 'normal').map(item => (
              <div key={item.type} className="flex items-center justify-between p-3 bg-background rounded border border-border">
                <span className="font-semibold text-foreground">{item.type}: {item.units} units</span>
                <Badge className={item.status === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900'}>
                  {item.status.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Update Inventory */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Update Inventory</CardTitle>
          <CardDescription>Add or remove blood units</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <select className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground">
                {bloodInventory.map(item => (
                  <option key={item.type} value={item.type}>{item.type}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="units">Units to Add</Label>
              <Input
                id="units"
                type="number"
                placeholder="Enter number of units"
                className="border-border"
              />
            </div>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Update Inventory
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
