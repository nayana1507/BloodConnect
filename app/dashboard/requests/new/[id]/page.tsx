// app/dashboard/requests/[id]/page.tsx
import { notFound } from 'next/navigation';

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  // You can fetch the request here later – for now just show ID
  const requestId = params.id;

  if (!requestId) notFound();

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Blood Request Details</h1>
      
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Request ID: {requestId}</h2>
        <p className="text-muted-foreground">
          (Full details loading coming soon – hospital, patient info, contact, etc.)
        </p>
      </div>
      
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
          Contact Recipient
        </button>
        <button className="px-4 py-2 border rounded-md">
          Back to Requests
        </button>
      </div>
    </div>
  );
}