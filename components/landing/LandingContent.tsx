'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Users, Zap, Shield } from 'lucide-react';

export default function LandingContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">BloodConnect</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-foreground hover:bg-secondary/20">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-bold text-foreground text-balance">
                Connect Blood Donors & Recipients
              </h1>
              <p className="text-xl text-foreground/70 max-w-2xl mx-auto text-balance">
                BloodConnect is a college blood donation platform that matches donors with recipients in real-time. Save lives within your campus community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  Become a Donor
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                  Request Blood
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/5 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why BloodConnect?</h2>
            <p className="text-foreground/60 max-w-2xl mx-auto">
              Smart matching, instant notifications, and community-driven blood donation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-border">
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Instant Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Smart blood compatibility algorithm matches donors with recipients instantly
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Community Driven</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Connect with fellow college students committed to saving lives
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Secure & Safe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Your health information is encrypted and protected with enterprise security
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <Heart className="w-8 h-8 text-primary mb-4" />
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground/70">
                  Get instant notifications about blood matches and donation opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to Make a Difference?</h2>
            <p className="text-xl text-foreground/60">
              Join thousands of students in your college helping save lives through blood donation
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                Sign Up Now
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Already a Member?
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary/5 border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-primary fill-primary" />
                <span className="font-bold text-foreground">BloodConnect</span>
              </div>
              <p className="text-sm text-foreground/60">
                Connecting blood donors and recipients in college communities
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">For Donors</Link></li>
                <li><Link href="#" className="hover:text-foreground">For Recipients</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blood Types</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">FAQ</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-foreground/60">
            <p>&copy; 2024 BloodConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
