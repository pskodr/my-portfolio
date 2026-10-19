import type { Role } from "@/content/experience";

export function RoleList({ roles }: { roles: Role[] }) {
  return (
    <ol className="roles">
      {roles.map((r) => (
        <li key={r.org} className="role">
          <div className="role-head">
            <h3 className="role-org">{r.org}</h3>
            {r.period && <span className="role-period">{r.period}</span>}
          </div>
          <p className="role-title">{r.title}</p>
          {r.points.length > 0 && (
            <ul className="bullets">
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          )}
          {r.pending && <p className="role-pending">{r.pending}</p>}
        </li>
      ))}
    </ol>
  );
}
