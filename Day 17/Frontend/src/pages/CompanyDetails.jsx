import ResourceDetails from "../components/ResourceDetails";
import { getCompanyById } from "../services/companyService";

export default function CompanyDetails() {
  return (
    <ResourceDetails
      name="company"
      backTo="/companies"
      fetcher={getCompanyById}
      rows={(c) => [
        ["Industry", c.industry],
        ["Location", c.location],
        ["Website", c.website],
        ["Size", c.size],
        ["Description", c.description],
        ["Active", c.isActive ? "Yes" : "No"],
        ["Created", new Date(c.createdAt).toLocaleString()],
      ]}
    />
  );
}