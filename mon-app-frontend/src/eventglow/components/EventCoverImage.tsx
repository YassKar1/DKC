import { useEffect, useState } from "react";

const FALLBACK = "/placeholder.svg";

type Props = {
  src: string | undefined;
  alt: string;
  className?: string;
};

/** Image événement avec repli si URL externe (Unsplash) ou réseau échoue. */
export default function EventCoverImage({ src, alt, className }: Props) {
  const [url, setUrl] = useState(() => (src && src.trim() !== "" ? src : FALLBACK));

  useEffect(() => {
    setUrl(src && src.trim() !== "" ? src : FALLBACK);
  }, [src]);

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => setUrl(FALLBACK)}
    />
  );
}
