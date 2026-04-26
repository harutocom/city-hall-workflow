import ApplicationListTable from "@/components/features/applications/ApplicationListTable";

export default function DraftApplicationsPage() {
  return <ApplicationListTable title="下書き一覧" statusFilter="draft" />;
}
