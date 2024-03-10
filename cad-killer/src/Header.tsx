import React from 'react';

const Header: React.FC = () => {
    return (
        <header id="head" className="wrapper">
            <section>
                <h1><a href="./">CAD-Killer</a></h1>
            </section>
            <section className="menu">
                <a href="http://adresse.data.gouv.fr">Basé sur adresse.data.gouv.fr</a>
            </section>
        </header>
    );
};

export default Header;