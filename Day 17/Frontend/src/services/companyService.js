import { createCrudService } from "./crudService";
const service = createCrudService("companies");

export const getCompanies = service.getAll;
export const getCompanyById = service.getById;
export const createCompany = service.create;
export const updateCompany = service.update;
export const deleteCompany = service.remove;