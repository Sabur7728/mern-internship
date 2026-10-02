import { NavLink } from "react-router";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2>CareerConnect</h2>

      <NavLink to="/dashboard">
        Dashboard
      </NavLink>

      <NavLink to="/jobs">
        Jobs
      </NavLink>

      <NavLink to="/candidates">
        Candidates
      </NavLink>

      <NavLink to="/candidates/new">
        Add Candidate
      </NavLink>
    </aside>
  );
}

export default Sidebar;