'use client';

import PlacesTable from '@/components/admin/places-table';
import { templesData } from '@/data/temples-data';

export default function AdminPlacesPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Places Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage all temples and sacred places in the system
        </p>
      </div>

      {/* Places Table */}
      <PlacesTable places={templesData} />
    </div>
  );
}