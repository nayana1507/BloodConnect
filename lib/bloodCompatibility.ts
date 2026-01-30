export type BloodType = 'O-' | 'O+' | 'A-' | 'A+' | 'B-' | 'B+' | 'AB-' | 'AB+';

// Blood compatibility matrix for donations
// Key: donor blood type, Value: array of recipient blood types
const donationCompatibility: Record<BloodType, BloodType[]> = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+'], // Universal recipient (can only receive AB+)
};

// Blood compatibility matrix for receiving
// Key: recipient blood type, Value: array of donor blood types
const recipientCompatibility: Record<BloodType, BloodType[]> = {
  'O-': ['O-'], // Can only receive O-
  'O+': ['O-', 'O+'],
  'A-': ['O-', 'A-'],
  'A+': ['O-', 'O+', 'A-', 'A+'],
  'B-': ['O-', 'B-'],
  'B+': ['O-', 'O+', 'B-', 'B+'],
  'AB-': ['O-', 'A-', 'B-', 'AB-'],
  'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal recipient
};

export function canDonate(donorBlood: BloodType, recipientBlood: BloodType): boolean {
  return donationCompatibility[donorBlood].includes(recipientBlood);
}

export function canReceive(recipientBlood: BloodType, donorBlood: BloodType): boolean {
  return recipientCompatibility[recipientBlood].includes(donorBlood);
}

export function getCompatibleDonors(recipientBlood: BloodType): BloodType[] {
  return recipientCompatibility[recipientBlood];
}

export function getCompatibleRecipients(donorBlood: BloodType): BloodType[] {
  return donationCompatibility[donorBlood];
}

export const BLOOD_TYPES: BloodType[] = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
