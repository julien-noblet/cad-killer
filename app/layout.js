import React from "react";
import "../src/scss/style.scss";

export const metadata = {
  title: "cad-killer",
  description: "Visionneur de carte pour logisticiens pressés",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
