import React from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import "../src/scss/style.scss";

export const metadata: Metadata = {
  title: "cad-killer",
  description: "Visionneur de carte pour logisticiens pressés",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <head />
      <body className="map">{children}</body>
    </html>
  );
}
