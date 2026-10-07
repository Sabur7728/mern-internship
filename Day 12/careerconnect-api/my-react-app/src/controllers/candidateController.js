import * as candidateService from "../services/candidateService.js";

export function getCandidates(request, response) {
  const data = candidateService.getCandidates(request.query);
  response.status(200).json({ success: true, count: data.length, data });
}

export function getCandidateById(request, response) {
  response.json({ success: true, data: candidateService.getCandidateById(request.params.id) });
}

export function createCandidate(request, response) {
  const data = candidateService.createCandidate(request.body ?? {});
  response.status(201).json({ success: true, data });
}

export function replaceCandidate(request, response) {
  const data = candidateService.replaceCandidate(request.params.id, request.body ?? {});
  response.json({ success: true, data });
}

export function updateCandidate(request, response) {
  const data = candidateService.updateCandidate(request.params.id, request.body ?? {});
  response.json({ success: true, data });
}

export function deleteCandidate(request, response) {
  const data = candidateService.removeCandidate(request.params.id);
  response.json({ success: true, message: "Candidate deleted successfully", data });
}