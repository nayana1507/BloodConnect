'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BLOOD_TYPES } from '@/lib/bloodCompatibility'; // Make sure this export exists
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

  const minDate = new Date().toISOString().split('T')[0]; // Today or later

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = 
    formData.bloodType &&
    parseInt(formData.quantity) >= 1 &&
    formData.reason.trim().length > 10 &&
    formData.requiredDate >= minDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.uid) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a request",
        variant: "destructive",
      });
      return;
    }

    if (!formData.bloodType) {
      toast({
        title: "Missing Field",
        description: "Please select a blood type",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.requiredDate) < new Date()) {
      toast({
        title: "Invalid Date",
        description: "Required date cannot be in the past",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const bloodRequest = {
        recipientId: user.uid,
        bloodType: formData.bloodType,
        quantity: parseInt(formData.quantity),
        urgency: formData.urgency,
        reason: formData.reason.trim(),
        requiredDate: formData.requiredDate,
        status: 'open',
        matchedDonors: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'bloodRequests'), bloodRequest);

      toast({
        title: "Request Created",
        description: "Your blood request has been posted successfully.",
      });

      router.push('/dashboard/requests');
      router.refresh(); // Optional: force refresh to show the new request immediately
    } catch (error: any) {
      console.error('Error creating request:', error);
      toast({
        title: "Creation Failed",
        description: error.message || "Could not create blood request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-2xl mx-auto">
      <div className="space-y-2">
        <Link
          href="/dashboard/requests"
          className="inline-flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Requests
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Blood Request</h1>
        <p className="text-muted-foreground">
          Share the details of the blood you need
        </p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            Request Information
          </CardTitle>
          <CardDescription>
            Fill in the details so compatible donors can find and help you
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Type */}
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type Required *</Label>
              <Select
                value={formData.bloodType}
                onValueChange={(value) => handleSelectChange('bloodType', value)}
                required
              >
                <SelectTrigger id="bloodType">
                  <SelectValue placeholder="Select blood type" />
                </SelectTrigger>
                <SelectContent>
                  {BLOOD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity & Urgency */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quantity">Units Needed *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level *</Label>
                <Select
                  value={formData.urgency}
                  onValueChange={(value) => handleSelectChange('urgency', value)}
                  required
                >
                  <SelectTrigger id="urgency">
                    <SelectValue placeholder="Select urgency" />
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

            {/* Required Date */}
            <div className="space-y-2">
              <Label htmlFor="requiredDate">Date Needed By *</Label>
              <Input
                id="requiredDate"
                name="requiredDate"
                type="date"
                min={minDate}
                value={formData.requiredDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Request *</Label>
              <Textarea
                id="reason"
                name="reason"
                placeholder="e.g., Major surgery, thalassemia treatment, accident..."
                value={formData.reason}
                onChange={handleInputChange}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                className="flex-1 sm:flex-none sm:w-32"
                asChild
                disabled={loading}
              >
                <Link href="/dashboard/requests">Cancel</Link>
              </Button>

              <Button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Creating...
                  </span>
                ) : (
                  'Create Request'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info box */}
      <Card className="bg-muted/40 border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Important Notes</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• Your request will be visible to compatible donors in your network.</p>
          <p>• Donors can contact you directly via messages to coordinate.</p>
          <p>• Always follow proper medical protocols and screening for blood transfusions.</p>
          <p>• You can edit or cancel this request from the main requests page.</p>
        </CardContent>
      </Card>
    </div>
  );
}