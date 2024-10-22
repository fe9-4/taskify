"use client";

import ColorChip from "@/components/chip/ColorChip";
import { NumChip, PlusChip } from "@/components/chip/PlusAndNumChip";
import ColumnList from "@/components/dashboard/ColumnList";
import SearchDropdown from "@/components/dropdown/SearchDropdown";

const Dashboard = () => {
  return (
    <div className="flex flex-col space-y-6">
      <ColumnList />
    </div>
  );
};

export default Dashboard;
