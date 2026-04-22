import React from "react";
import MapClient from "./map-client";

export default function HomePage() {
  return (
    <>
      <header id="head" className="wrapper">
        <section>
          <h1>
            <a href="/">CAD-Killer</a>
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
