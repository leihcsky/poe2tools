import Image from "next/image";

/**
 * Local SVGs in /public often fail or misbehave with next/image optimization.
 * Use a plain <img> for .svg; next/image for raster formats.
 */
export default function GuideCoverImage({
  src,
  alt,
  width,
  height,
  className,
  fill,
  sizes,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string;
}) {
  if (src.endsWith(".svg")) {
    if (fill) {
      return (
        <img
          src={src}
          alt={alt}
          className={className ?? "h-full w-full object-cover"}
          loading="lazy"
          decoding="async"
        />
      );
    }
    return (
      <img
        src={src}
        alt={alt}
        width={width ?? 1200}
        height={height ?? 630}
        className={className ?? "h-auto w-full"}
        loading="lazy"
        decoding="async"
      />
    );
  }
  if (fill) {
    return <Image src={src} alt={alt} fill sizes={sizes} className={className} />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 1200}
      height={height ?? 630}
      className={className ?? "h-auto w-full"}
    />
  );
}
