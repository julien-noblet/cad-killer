import React from "react";
import Link from "next/link";
import MapClient from "./map-client";

export default function HomePage() {
  return (
    <>
      <header id="head" className="wrapper">
        <section>
          <h1>
            <Link href="/">CAD-Killer</Link>
          </h1>
        </section>
        <section className="menu">
          <a href="http://adresse.data.gouv.fr">
            Basé sur adresse.data.gouv.fr
          </a>
        </section>
      </header>
      <div id="label" />
      <main className="content" role="main">
        <div id="map" />
      </main>
      <MapClient />
    </>
  );
}
