import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Jobs from "./Jobs";
import api from "../services/api";

vi.mock("../services/api", () => ({ default: { get: vi.fn() } }));

const renderPage = () => render(<MemoryRouter><Jobs /></MemoryRouter>);

describe("Jobs page states", () => {
  beforeEach(() => vi.clearAllMocks());

  it("UI-001 shows loading first", () => {
    api.get.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByRole("status")).toHaveTextContent(/loading jobs/i);
  });

  it("shows jobs on success", async () => {
    api.get.mockResolvedValue({
      data: {
        data: [{ _id: "1", title: "MERN Dev", company: "Acme", location: "Pune", salary: 500000, experience: 2 }],
        pagination: { page: 1, limit: 9, total: 1, pages: 1 },
      },
    });
    renderPage();
    expect(await screen.findByText("MERN Dev")).toBeInTheDocument();
  });

  it("UI-003 shows empty state", async () => {
    api.get.mockResolvedValue({ data: { data: [], pagination: { page: 1, limit: 9, total: 0, pages: 0 } } });
    renderPage();
    expect(await screen.findByText(/no jobs found/i)).toBeInTheDocument();
  });

  it("UI-002 shows error state with retry", async () => {
    api.get.mockRejectedValue({ response: { data: { message: "Unable to load jobs" } } });
    renderPage();
    expect(await screen.findByRole("alert")).toHaveTextContent(/unable to load jobs/i);
    expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
  });
});
