import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PullRequestSection, type PullRequestSectionLabels } from "@/components/molecules/PullRequestSection";

const labels: PullRequestSectionLabels = {
  heading: "Pull request",
  url: "Pull request URL",
  urlPlaceholder: "https://github.com/owner/repo/pull/123",
  urlHint: "Paste the URL of a pull request from a public repository.",
  link: "Link pull request",
  linking: "Linking…",
  unlink: "Unlink pull request",
  unlinking: "Unlinking…",
  unlinkFailed: "We could not unlink the pull request.",
  opensInNewTab: "(opens in a new tab)",
  syncedAt: "Updated {time}",
  errors: {
    invalidUrl: "That is not a GitHub pull request URL.",
    notFound: "We could not find that pull request.",
    unauthorized: "Your GitHub connection expired.",
    unavailable: "GitHub did not respond.",
  },
  prStates: { draft: "Draft", open: "Open", merged: "Merged", closed: "Closed" },
};

const pullRequest = {
  owner: "elianisdev",
  repo: "devflow-ai",
  number: 15,
  url: "https://github.com/elianisdev/devflow-ai/pull/15",
  title: "feat: accessible drag and drop for board tasks",
  state: "merged" as const,
  syncedAt: new Date(),
};

describe("PullRequestSection", () => {
  it("sends the URL and announces why it could not be linked", async () => {
    const linkAction = jest.fn().mockResolvedValue({ error: "notFound" });
    render(
      <PullRequestSection pullRequest={null} labels={labels} locale="en" linkAction={linkAction} unlinkAction={jest.fn()} />,
    );

    await userEvent.type(screen.getByLabelText("Pull request URL"), "https://github.com/elianisdev/devflow-ai/pull/99");
    await userEvent.click(screen.getByRole("button", { name: "Link pull request" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("We could not find that pull request.");
    expect(screen.getByLabelText("Pull request URL")).toHaveAttribute("aria-invalid", "true");
    expect(linkAction.mock.calls[0][1].get("url")).toBe("https://github.com/elianisdev/devflow-ai/pull/99");
    expect(screen.getByLabelText("Pull request URL")).toHaveValue("https://github.com/elianisdev/devflow-ai/pull/99");
  });

  it("shows the state with text, links to GitHub in a new tab and unlinks", async () => {
    const unlinkAction = jest.fn().mockResolvedValue(undefined);
    render(
      <PullRequestSection
        pullRequest={pullRequest}
        labels={labels}
        locale="en"
        linkAction={jest.fn()}
        unlinkAction={unlinkAction}
      />,
    );

    expect(screen.getByText("Merged")).toBeInTheDocument();
    expect(screen.getByText("Updated now")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /accessible drag and drop.*opens in a new tab/ });
    expect(link).toHaveAttribute("href", pullRequest.url);
    expect(link).toHaveAttribute("target", "_blank");

    await userEvent.click(screen.getByRole("button", { name: "Unlink pull request" }));

    expect(unlinkAction).toHaveBeenCalled();
  });
});
