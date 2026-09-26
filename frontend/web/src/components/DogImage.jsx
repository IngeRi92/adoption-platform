"use client";

import { useState } from "react";
import { PLACEHOLDER_PHOTO } from "@/lib/format";

// Plain <img> that switches to a placeholder if the photo is missing or fails to load
export default function DogImage({ src, alt, className }) {
  const [failed, setFailed] = useState(false);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={!src || failed ? PLACEHOLDER_PHOTO : src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
