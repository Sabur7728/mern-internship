import { useNavigate } from "react-router";
import { useState } from "react";

function AddCandidate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter candidate name");
      return;
    }

    alert("Candidate created successfully!");

    navigate("/candidates");
  }

  return (
    <div className="page">
      <h1>Add Candidate</h1>

      <form
        className="form"
        onSubmit={handleSubmit}
      >
        <label>
          Candidate Name
        </label>

        <input
          type="text"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          placeholder="Enter candidate name"
        />

        <button type="submit">
          Add Candidate
        </button>
      </form>
    </div>
  );
}

export default AddCandidate;