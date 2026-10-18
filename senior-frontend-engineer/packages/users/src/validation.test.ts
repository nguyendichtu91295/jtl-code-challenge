import { describe, expect, it } from "vitest";
import { validateUsername } from "./validation";

describe("validateUsername", () => {
  it("trims outer whitespace and accepts case-sensitive values at the length limits", () => {
    expect(validateUsername("  A  ")).toEqual({});
    expect(validateUsername("u".repeat(40))).toEqual({});
  });

  it("rejects blank and overlong usernames", () => {
    expect(validateUsername("   ").username).toBe("Enter a username.");
    expect(validateUsername("u".repeat(41)).username).toBe("Username must be 40 characters or fewer.");
  });
});
