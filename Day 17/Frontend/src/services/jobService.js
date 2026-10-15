import { createCrudService } from "./crudService";
const service = createCrudService("jobs");

export const getJobs = service.getAll;
export const getJobById = service.getById;
export const createJob = service.create;
export const updateJob = service.update;
export const deleteJob = service.remove;