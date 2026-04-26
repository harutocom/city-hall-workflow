import ApplicationListTable from "@/components/features/applications/ApplicationListTable";

export default function PendingApplicationsPage() {
  return <ApplicationListTable title="申請中一覧" statusFilter="pending" />;
}
