import { render, screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import EventList from "./EventList";

// MSW: fake the /api/events response
const server = setupServer(
  http.get("/api/events", () =>
    HttpResponse.json([
      { id: 1, title: "React Meetup" },
      { id: 2, title: "JavaScript Conference" },
      { id: 3, title: "Open Source Hackathon" },
    ])
  )
);

beforeAll(() => server.listen());
afterAll(() => server.close());

test("shows all event titles after the API responds", async () => {
  render(<EventList />);

  expect(await screen.findByText("React Meetup")).toBeTruthy();
  expect(screen.getByText("JavaScript Conference")).toBeTruthy();
  expect(screen.getByText("Open Source Hackathon")).toBeTruthy();
});

test("shows Loading... while fetching", async () => {
  render(<EventList />);

  expect(screen.getByText("Loading...")).toBeTruthy();

  await screen.findByText("React Meetup"); // let the request finish
});
