import { useState } from "react";
import { AnimatedButtons } from "../ui/AnimatedButtons";
const applicants = [
  { id: "kavita", name: "Dr. Kavita Singh", department: "RMC Mumbai" },
  { id: "suresh", name: "Suresh Patel", department: "NCMRWF" },
  { id: "nisha", name: "Nisha Thomas", department: "RMC Chennai" },
  { id: "amit", name: "Amit Kumar", department: "Climate Research" },
];
export function UserApprovalTable() {
  const [query, setQuery] = useState("");
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  return (
    <section className="panel">
      <div className="table-toolbar">
        <label className="search">
          <span className="sr-only">Search applicants</span>
          <input
            placeholder="Search applicants"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <span className="pill">
          {applicants.filter((user) => !decisions[user.id]).length} pending
        </span>
      </div>
      <p className="mb-4 text-xs text-slate-500">
        Demo review queue · decisions apply to this session.
      </p>
      <div className="overflow-x-auto" data-lenis-prevent>
        <table>
          <caption className="sr-only">User approval requests</caption>
          <thead>
            <tr>
              <th scope="col">Applicant</th>
              <th scope="col">Department</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {applicants
              .filter((user) =>
                `${user.name} ${user.department}`
                  .toLowerCase()
                  .includes(query.toLowerCase()),
              )
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.department}</td>
                  <td>
                    <span role="status" className="pill">
                      {decisions[user.id] || "Pending"}
                    </span>
                  </td>
                  <td>
                    {decisions[user.id] ? (
                      <AnimatedButtons
                        className="secondary"
                        onClick={() =>
                          setDecisions((previous) => {
                            const next = { ...previous };
                            delete next[user.id];
                            return next;
                          })
                        }
                      >
                        Undo
                      </AnimatedButtons>
                    ) : (
                      <>
                        <AnimatedButtons
                          className="approve"
                          aria-label={`Approve ${user.name}`}
                          onClick={() =>
                            setDecisions((previous) => ({
                              ...previous,
                              [user.id]: "Approved",
                            }))
                          }
                        >
                          Approve
                        </AnimatedButtons>
                        <AnimatedButtons
                          className="reject"
                          aria-label={`Reject ${user.name}`}
                          onClick={() =>
                            setDecisions((previous) => ({
                              ...previous,
                              [user.id]: "Rejected",
                            }))
                          }
                        >
                          Reject
                        </AnimatedButtons>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
