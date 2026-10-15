import ResourceForm from "./ResourceForm";
import { createCompany, updateCompany } from "../services/companyService";

const fields = [
  { name: "name", label: "Company Name", required: true },
  { name: "industry", label: "Industry" },
  { name: "location", label: "Location" },
  { name: "website", label: "Website", placeholder: "https://" },
  { name: "size", label: "Company Size", type: "select", options: ["1-10", "11-50", "51-200", "201-1000", "1000+"], default: "1-10" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "isActive", label: "Active", type: "checkbox", default: true },
];

export default function CompanyForm(props) {
  return <ResourceForm label="Company" fields={fields} createFn={createCompany} updateFn={updateCompany} {...props} />;
}