import jobs from "../data/jobs";

function simulateRequest(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, 800);
  });
}

export async function getJobs() {
  return simulateRequest(jobs);
}

export async function getJobById(jobId) {
  const job = jobs.find(
    (item) => item.id === Number(jobId)
  );

  if (!job) {
    throw new Error("Job not found");
  }

  return simulateRequest(job);
}

export async function createJob(job) {
  const newJob = {
    ...job,
    id: Date.now()
  };

  return simulateRequest(newJob);
}

export async function updateJob(jobId, updatedJob) {
  const job = {
    ...updatedJob,
    id: Number(jobId)
  };

  return simulateRequest(job);
}

export async function deleteJob(jobId) {
  return simulateRequest({
    success: true,
    id: Number(jobId)
  });
}