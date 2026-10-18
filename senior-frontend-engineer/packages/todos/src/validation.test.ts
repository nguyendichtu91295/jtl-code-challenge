import { describe, expect, it } from "vitest";
import { validateCreateTodo } from "./validation";

describe("validateCreateTodo", () => {
  it("accepts trimmed titles at the length boundary when an assignee is selected", () => {
    expect(validateCreateTodo("  Review  ", "user-1")).toEqual({});
    expect(validateCreateTodo("t".repeat(200), "user-1")).toEqual({});
  });

  it("reports blank or long titles and missing assignees", () => {
    expect(validateCreateTodo("  ", "user-1")).toEqual({ title: "Enter a task title." });
    expect(validateCreateTodo("t".repeat(201), "user-1")).toEqual({ title: "Task title must be 200 characters or fewer." });
    expect(validateCreateTodo("Valid", "")).toEqual({ assigneeId: "Choose a user." });
  });
});
