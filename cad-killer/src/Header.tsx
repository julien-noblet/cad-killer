import React from 'react';

const Header: React.FC = () => {
    return (
        <header id="head" className="wrapper" style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#333",
            color: "#fff",
            padding: "0.5em 1em",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "60px",
            margin: 0,
        }}>
            <section style={{margin: 0}}>
                <h1 style={{margin: 0}}><a style={{
                    margin: 0,
                    color: "#fff",
                    fontFamily: "open_sanslight",
                }}href="./">CAD-Killer</a></h1>
            </section>
            <section className="menu" style={{margin: 0}}>
                <a style={{margin: 0}} href="http://adresse.data.gouv.fr">Basé sur adresse.data.gouv.fr</a>
            </section>
        </header>
    );
};

export default Header;