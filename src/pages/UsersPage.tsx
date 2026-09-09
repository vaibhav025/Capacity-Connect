import { UserApprovalTable } from "../components/admin/UserApprovalTable";
import { PageTitle } from "../components/ui/PageTitle";
export function UsersPage() {
  return (
    <>
      <PageTitle
        title="User approvals"
        desc="Review identity requests and workspace access."
      />
      <UserApprovalTable />
    </>
  );
}
