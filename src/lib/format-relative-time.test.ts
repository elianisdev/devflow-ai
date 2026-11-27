import { formatRelativeTime } from "@/lib/format-relative-time";

const now = new Date("2026-11-27T12:00:00Z").getTime();
const ago = (seconds: number) => new Date(now - seconds * 1000);

describe("formatRelativeTime", () => {
  it("says now for less than a minute", () => {
    expect(formatRelativeTime(ago(30), now, "en")).toBe("now");
    expect(formatRelativeTime(ago(30), now, "es")).toBe("ahora");
  });

  it("uses the largest whole unit", () => {
    expect(formatRelativeTime(ago(150), now, "en")).toBe("2 minutes ago");
    expect(formatRelativeTime(ago(7_200), now, "es")).toBe("hace 2 horas");
    expect(formatRelativeTime(ago(86_400), now, "en")).toBe("yesterday");
  });
});
