import { Link } from "react-router";

function Jobs() {
  const jobs = [
    {
      id: 101,
      title: "MERN Stack Developer",
      company: "CareerConnect Technologies",
      location: "Bangalore",
    },
    {
      id: 102,
      title: "Frontend Developer",
      company: "Tech Solutions",
      location: "Pune",
    },
    {
      id: 103,
      title: "Backend Developer",
      company: "CodeWorks",
      location: "Hyderabad",
    },
  ];

  return (
    <div className="page">
      <h1>Jobs</h1>

      <div className="card-grid">
        {jobs.map((job) => (
          <div className="card" key={job.id}>
            <h2>{job.title}</h2>

            <p>{job.company}</p>

            <p>{job.location}</p>

            <Link to={`/jobs/${job.id}`}>
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;