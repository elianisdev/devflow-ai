type TaskCardFaceProps = {
  title: string;
  description: string | null;
  noPullRequestLabel: string;
};

export function TaskCardFace({ title, description, noPullRequestLabel }: TaskCardFaceProps) {
  return (
    <>
      <span className="text-body-sm font-semibold">{title}</span>
      {description && <span className="line-clamp-2 text-caption text-neutral-600">{description}</span>}
      <span className="font-mono text-data text-neutral-600">{noPullRequestLabel}</span>
    </>
  );
}
