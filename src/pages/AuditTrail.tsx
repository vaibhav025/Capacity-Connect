import { useState } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { PageTitle } from "../components/ui/PageTitle";
import { useDemo } from "../lib/demoStore";

export function AuditTrail() {
  const { auditLog } = useDemo();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  const actions = [
    "All",
    ...new Set(auditLog.map((a) => a.action)),
  ];
  const roles = ["All", "ADMIN", "TRAINER", "SYSTEM"];

  const filtered = auditLog.filter(
    (entry) =>
      (actionFilter === "All" || entry.action === actionFilter) &&
      (roleFilter === "All" || entry.role === roleFilter) &&
      (search === "" ||
        entry.user.toLowerCase().includes(search.toLowerCase()) ||
        entry.resource.toLowerCase().includes(search.toLowerCase()) ||
        entry.details.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <>
      <PageTitle
        title="System Audit Trail"
        desc="Detailed log of all administrative actions and system events."
      />

      <div className="audit-toolbar">
        <div className="search">
          <Search size={15} />
          <input
            placeholder="Search by user, resource, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            className="filter"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          >
            {actions.map((a) => (
              <option key={a} value={a}>
                {a === "All" ? "All Actions" : a}
              </option>
            ))}
          </select>
          <select
            className="filter"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map((r) => (
              <option key={r} value={r}>
                {r === "All" ? "All Roles" : r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="panel audit-panel">
        <div className="audit-table-wrapper">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Role</th>
                <th>Action</th>
                <th>Resource</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <span className="audit-time">
                      <Clock size={12} />
                      {new Date(entry.timestamp).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td>
                    <span className="audit-user">
                      <User size={12} />
                      {entry.user}
                    </span>
                  </td>
                  <td>
                    <span className={`pill role-${entry.role.toLowerCase()}`}>
                      {entry.role}
                    </span>
                  </td>
                  <td>
                    <span className="audit-action">{entry.action}</span>
                  </td>
                  <td>
                    <span className="audit-resource">
                      <FileText size={12} />
                      {entry.resource}
                    </span>
                  </td>
                  <td>
                    <span className="audit-details">{entry.details}</span>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: 40 }}>
                    No audit entries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
