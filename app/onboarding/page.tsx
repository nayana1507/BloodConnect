'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import Link from 'next/link';

function OnboardingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const role = searchParams.get('role') || 'donor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 flex items-center justify-center p-4">
      <Card className="border-border max-w-md w-full">
        <CardHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <Heart className="w-12 h-12 text-primary fill-primary" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome to BloodConnect!</CardTitle>
            <CardDescription className="mt-2">
              {role === 'donor'
                ? 'Thank you for becoming a blood donor'
                : 'Your request has been registered'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {role === 'donor' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">What happens next?</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>Complete your health screening questionnaire</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>Verify your medical eligibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>Set your availability status</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <span>Start helping people in need!</span>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary/5 p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground">
                  Recipients with compatible blood types can now see your profile and request your help.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">What happens next?</h3>
                <ul className="space-y-2 text-sm text-foreground/70">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">1.</span>
                    <span>Your request is shared with compatible donors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">2.</span>
                    <span>Donors can contact you to arrange donation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">3.</span>
                    <span>Coordinate pickup or donation location</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">4.</span>
                    <span>Get the blood you need safely</span>
                  </li>
                </ul>
              </div>

              <div className="bg-secondary/5 p-4 rounded-lg border border-border">
                <p className="text-sm text-foreground">
                  You'll be matched with available donors in your network immediately.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4 border-t border-border">
            <Link href="/dashboard" className="block">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/dashboard/profile" className="block">
              <Button variant="outline" className="w-full border-border bg-transparent">
                Complete Profile
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
