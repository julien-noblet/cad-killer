import React from "react";
import "material-design-iconic-font/dist/css/material-design-iconic-font.css";
import "../src/scss/style.scss";

export const metadata = {
  title: "cad-killer",
  description: "Visionneur de carte pour logisticiens pressés",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head />
      <body className="map">{children}</body>
    </html>
  );
}
