"use client";

import { useEffect } from "react";

export default function MapClient() {
  useEffect(() => {
    import("../src/js/map");
  }, []);

  return null;
}
