import { render, screen } from "@testing-library/react";
import App from "../App";

vi.mock("react-router-dom", async () => ({
  ...((await vi.importActual("react-router-dom")) as any),
  useLocation: vi.fn(),
}));

describe("App", () => {
  it("should render button", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "Click Me" })
    ).toBeInTheDocument();
  });
});
