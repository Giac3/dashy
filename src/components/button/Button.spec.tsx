import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("should disable clicking when disabled is true", () => {
    const mockClick = vi.fn();
    render(
      <Button onClick={mockClick} disabled>
        click me
      </Button>
    );

    fireEvent.click(screen.getByText("click me"));
    expect(mockClick).not.toHaveBeenCalled();
    expect(screen.getByText("click me")).toBeDisabled();
  });
});
