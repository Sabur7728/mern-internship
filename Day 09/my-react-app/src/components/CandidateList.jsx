import CandidateCard from "./CandidateCard";

function CandidateList({ candidates }) {
  return (
    <div className="candidate-list">
      {candidates.map((candidate) => (
        <CandidateCard
          key={candidate.id}
          candidate={candidate}
        />
      ))}
    </div>
  );
}

export default CandidateList;