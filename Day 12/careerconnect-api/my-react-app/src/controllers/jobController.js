import * as jobService from "../services/jobService.js";

export function getJobs(request, response) {
  const data = jobService.getJobs(request.query);
  response.status(200).json({ success: true, count: data.length, data });
}

export function getJobById(request, response) {
  response.json({ success: true, data: jobService.getJobById(request.params.id) });
}

export function createJob(request, response) {
  const data = jobService.createJob(request.body ?? {});
  response.status(201).json({ success: true, data });
}

export function replaceJob(request, response) {
  const data = jobService.replaceJob(request.params.id, request.body ?? {});
  response.json({ success: true, data });
}

export function updateJob(request, response) {
  const data = jobService.updateJob(request.params.id, request.body ?? {});
  response.json({ success: true, data });
}

export function deleteJob(request, response) {
  const data = jobService.removeJob(request.params.id);
  response.json({ success: true, message: "Job deleted successfully", data });
}