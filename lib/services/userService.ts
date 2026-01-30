// lib/services/userService.ts
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { addMonths, isAfter } from 'date-fns';

export async function updateUserAfterDonation(userId: string, donationDate: Date): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.warn(`[userService] User document not found for UID: ${userId}`);
      return;
    }

    const currentData = userSnap.data() ?? {};

    // Get current total donations (safe fallback to 0 if missing or invalid)
    const currentTotal = typeof currentData.totalDonations === 'number' ? currentData.totalDonations : 0;

    const nextAvailable = addMonths(donationDate, 3);

    const updatePayload: Record<string, any> = {
      lastDonation: donationDate.toISOString(),          // ← matches your Firebase field name
      totalDonations: currentTotal + 1,                  // ← INCREMENT TOTAL DONATIONS
      isAvailable: false,                                // ← force to false after donation
      bloodStatus: 'Unavailable',
      nextAvailableDate: nextAvailable.toISOString(),
      updatedAt: serverTimestamp(),
    };

    await updateDoc(userRef, updatePayload);

    console.log(
      `[userService] SUCCESS: Updated user ${userId} after donation:\n` +
      `  • lastDonation: ${donationDate.toISOString()}\n` +
      `  • totalDonations: ${currentTotal + 1} (was ${currentTotal})\n` +
      `  • nextAvailableDate: ${nextAvailable.toISOString()}\n` +
      `  • bloodStatus: Unavailable\n` +
      `  • isAvailable: false`
    );
  } catch (error: any) {
    console.error('[userService] FAILED to update user after donation:', error);
  }
}

export async function getUserAvailability(
  userId: string
): Promise<'Available' | 'Unavailable' | 'Unknown'> {
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) {
      console.warn(`[userService] User not found: ${userId}`);
      return 'Unknown';
    }

    const data = userSnap.data() ?? {};

    // Prefer stored bloodStatus if present (most reliable)
    if (data.bloodStatus === 'Available' || data.bloodStatus === 'Unavailable') {
      return data.bloodStatus;
    }

    // Fallback: calculate from nextAvailableDate (ISO string)
    const nextStr = data.nextAvailableDate;
    if (!nextStr) {
      return data.isAvailable === false ? 'Unavailable' : 'Available';
    }

    const nextDate = new Date(nextStr);
    if (isNaN(nextDate.getTime())) {
      console.warn(`[userService] Invalid nextAvailableDate for ${userId}: ${nextStr}`);
      return data.isAvailable === false ? 'Unavailable' : 'Available';
    }

    return isAfter(new Date(), nextDate) ? 'Available' : 'Unavailable';
  } catch (error) {
    console.error('[userService] Error checking user availability:', error);
    return 'Unknown';
  }
}

export async function isUserEligibleToDonate(userId: string): Promise<boolean> {
  try {
    const userSnap = await getDoc(doc(db, 'users', userId));
    if (!userSnap.exists()) return false;

    const data = userSnap.data() ?? {};

    // Quick checks
    if (data.isAvailable === false) return false;
    if (data.bloodStatus === 'Unavailable') return false;

    const nextStr = data.nextAvailableDate;
    if (!nextStr) return true;

    const nextDate = new Date(nextStr);
    if (isNaN(nextDate.getTime())) return true;

    return isAfter(new Date(), nextDate);
  } catch (error) {
    console.error('[userService] Eligibility check failed:', error);
    return false;
  }
}