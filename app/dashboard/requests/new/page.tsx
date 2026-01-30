'use client';

import React from "react"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BLOOD_TYPES } from '@/lib/bloodCompatibility';
import { Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewRequestPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bloodType: '',
    quantity: '1',
    urgency: 'medium' as const,
    reason: '',
    requiredDate: new Date().toISOString().split('T')[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bloodType) {
      toast({
        title: "Error",
        description: "Please select a blood type",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const bloodRequest = {
        recipientId: user?.uid,
        bloodType: formData.bloodType,
        quantity: parseInt(formData.quantity),
        urgency: formData.urgency,
        reason: formData.reason,
        requiredDate: formData.requiredDate,
        status: 'open' as const,
        matchedDonors: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bloodRequests'), bloodRequest);

      toast({
        title: "Success",
        description: "Blood request created successfully!"
      });

      router.push('/dashboard/requests');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create request",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl">
      <div className="space-y-2">
        <Link href="/dashboard/requests" className="flex items-center gap-2 text-primary hover:underline w-fit">
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Create Blood Request</h1>
        <p className="text-foreground/60">Post a request for blood donations</p>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Blood Request Details
          </CardTitle>
          <CardDescription>
            Provide information about the blood you need
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type *</Label>
              <Select value={formData.bloodType} onValueChange={(value) => handleSelectChange('bloodType', value)}>
                <SelectTrigger className="border-border">
                  <SelectValue placeholder="Select blood type needed" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity (units) *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="border-border"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select value={formData.urgency} onValueChange={(value) => handleSelectChange('urgency', value)}>
                  <SelectTrigger className="border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDate">Required Date *</Label>
              <Input
                id="requiredDate"
                name="requiredDate"
                type="date"
                value={formData.requiredDate}
                onChange={handleInputChange}
                className="border-border"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request *</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="Explain why you need blood (e.g., surgery, medical condition, accident)"
                value={formData.reason}
                onChange={handleInputChange}
                className="border-border"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4 pt-6 border-t border-border">
              <Link href="/dashboard/requests" className="flex-1">
                <Button variant="outline" className="w-full border-border bg-transparent">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {loading ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border bg-secondary/5">
        <CardHeader>
          <CardTitle className="text-base">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/70">
          <p>
            Your request will be visible to all donors with compatible blood types in your network.
          </p>
          <p>
            Donors can see your request and contact you directly to arrange donations.
          </p>
          <p>
            Always ensure proper medical screening before receiving blood transfusions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
