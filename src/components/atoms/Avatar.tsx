import Image from "next/image";

type AvatarProps = {
  src: string;
  alt: string;
  size?: number;
};

export function Avatar({ src, alt, size = 32 }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className="rounded-full border border-neutral-200"
    />
  );
}
