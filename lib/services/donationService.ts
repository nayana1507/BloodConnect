import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  onSnapshot,
  Unsubscribe,
  QuerySnapshot,
  DocumentData,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { updateUserAfterDonation } from './userService';
import { DonationRecord } from '@/lib/types';
import { BloodType } from '../bloodCompatibility';

interface OfferDonationInput {
  donorId: string;
  requestId: string;
  units: number;
  date: Date;
  bloodType?: string; // optional – can be fetched from user if missing
}

export async function offerBloodDonation(input: OfferDonationInput): Promise<string> {
  const { donorId, requestId, units, date, bloodType: providedBloodType } = input;

  try {
    // Optional: Fetch donor's blood type if not provided
    let bloodType = providedBloodType;
    if (!bloodType) {
      const donorSnap = await getDoc(doc(db, 'users', donorId));
      if (donorSnap.exists()) {
        bloodType = donorSnap.data()?.bloodType as string | undefined;
      }
    }

    // 1. Create donation record
    const donationData: Partial<DonationRecord> = {
      donorId,
      requestId,
      units,
      bloodType: bloodType as BloodType | undefined,
      status: 'offered',
      offeredAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const donationRef = await addDoc(collection(db, 'donations'), donationData);

    // 2. Update blood request (decrease units needed)
    const requestRef = doc(db, 'bloodRequests', requestId);
    const requestSnap = await getDoc(requestRef);

    if (requestSnap.exists()) {
      const reqData = requestSnap.data() ?? {};
      const currentUnits = reqData.quantity ?? reqData.unitsNeeded ?? 1;
      const newUnits = Math.max(0, currentUnits - units);

      const updatePayload: Record<string, any> = {
        updatedAt: serverTimestamp(),
      };

      // Update the field that exists in your schema
      if ('quantity' in reqData) {
        updatePayload.quantity = newUnits;
      } else if ('unitsNeeded' in reqData) {
        updatePayload.unitsNeeded = newUnits;
      }

      // Auto-mark as matched if fulfilled
      if (newUnits <= 0) {
        updatePayload.status = 'matched';
      }

      await updateDoc(requestRef, updatePayload);
    } else {
      console.warn(`Request not found: ${requestId}. Donation recorded anyway.`);
    }

    // 3. Update donor's availability & last donation
    await updateUserAfterDonation(donorId, date);

    return donationRef.id;
  } catch (error: any) {
    console.error('Error offering blood donation:', error);
    throw new Error(error.message || 'Failed to offer blood. Please try again.');
  }
}

/**
 * Subscribe to real-time updates of a user's donations
 */
export function subscribeToUserDonations(
  userId: string,
  callback: (donations: DonationRecord[]) => void
): Unsubscribe {
  const q = query(
    collection(db, 'donations'),
    where('donorId', '==', userId),
    orderBy('offeredAt', 'desc')
  );

  return onSnapshot(
    q,
    (snapshot: QuerySnapshot<DocumentData>) => {
      const donations = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as DonationRecord[];
      callback(donations);
    },
    (error) => {
      console.error('Donations real-time listener failed:', error);
    }
  );
}