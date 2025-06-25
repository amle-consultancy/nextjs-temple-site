'use client';

import PlacesTable from '@/components/admin/places-table';
import { templesData } from '@/data/temples-data';

export default function AdminPlacesPage() {
  return (
    <div className="space-y-6">

      {/* Places Table */}
      <PlacesTable places={templesData} />
    </div>
  );
}