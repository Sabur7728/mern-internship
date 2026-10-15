import { useEffect, useState } from "react";
import { getMyProfile } from "../services/candidateService";
import CandidateForm from "../components/CandidateForm";
import StatusBadge from "../components/StatusBadge";

export default function MyProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyProfile();
        setProfile(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading profile...</p>;

  if (!profile || editing) {
    return (
      <div>
        <h2>My Profile</h2>
        {!profile && <p>Jobs par apply karne se pehle apni profile banayein.</p>}
        <CandidateForm
          mode={profile ? "edit" : "create"}
          initialData={profile}
          canSetStatus={false}
          onSuccess={(data) => {
            setProfile(data);
            setEditing(false);
            setSuccess("Profile saved successfully");
          }}
          onCancel={profile ? () => setEditing(false) : undefined}
        />
      </div>
    );
  }

  const rows = [
    ["Name", profile.name],
    ["Email", profile.email],
    ["Phone", profile.phone],
    ["Location", profile.location],
    ["Experience", `${profile.experience} yrs`],
    ["Position", profile.currentPosition],
    ["Skills", profile.skills.join(", ")],
    ["Status", <StatusBadge value={profile.status} />],
  ];

  return (
    <div className="detail-card">
      <h2>My Profile</h2>
      {success && <p style={{ color: "green" }}>{success}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rows.map(([label, value]) => (
        <div className="detail-row" key={label}>
          <span>{label}</span>
          <strong>{value || "-"}</strong>
        </div>
      ))}
      <button onClick={() => setEditing(true)} style={{ marginTop: 16 }}>Edit Profile</button>
    </div>
  );
}