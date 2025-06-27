# CAD-Killer

[![Code style: Prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Soutenir sur Liberapay](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/Julien_N/donate)
[![Tests CI](https://github.com/julien-noblet/cad-killer/actions/workflows/test.yml/badge.svg)](https://github.com/julien-noblet/cad-killer/actions/workflows/test.yml)
[![Coverage Status](https://coveralls.io/repos/github/julien-noblet/cad-killer/badge.svg?branch=master)](https://coveralls.io/github/julien-noblet/cad-killer?branch=master)

---

## Sommaire
- [Présentation](#présentation)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Installation rapide](#installation-rapide)
- [Utilisation](#utilisation)
- [Tests automatisés et CI](#tests-automatisés-et-ci)
- [Contribution](#contribution)
- [Remerciements](#remerciements)
- [Licence](#licence)

---

Démo en ligne : [Voir la démo](http://julien-noblet.github.io/cad-killer/)

## Présentation
CAD-Killer est un visionneur de carte performant et personnalisable, conçu pour répondre aux besoins des logisticiens et des utilisateurs exigeants. Il exploite OpenStreetMap et d'autres sources ouvertes pour offrir une expérience fluide, moderne et responsive.

## Fonctionnalités principales
- Recherche d'adresse instantanée (Photon)
- Affichage multi-fonds de carte (OSM, IGN, Cadastre, Esri, etc.)
- Outils de dessin et d'annotation avancés
- Géolocalisation précise de l'utilisateur
- Impression et export de la carte
- Interface responsive adaptée à tous les écrans

## Installation rapide

```bash
git clone https://github.com/julien-noblet/cad-killer.git
cd cad-killer
yarn install # ou npm install
```

## Utilisation
- `yarn start` : Lance le serveur de développement (hot reload)
- `yarn build` : Génère le build de production optimisé
- `yarn test` : Exécute les tests automatisés

## Tests automatisés et CI

Les tests unitaires et d'intégration sont exécutés automatiquement à chaque push et pull request grâce à GitHub Actions (voir `.github/workflows/test.yml`).

Pour lancer les tests en local :

```bash
npm test
```

## Contribution
Les contributions sont les bienvenues !

Merci de respecter le style du projet (Prettier, ESLint) et d'ouvrir une issue avant toute proposition de fonctionnalité majeure.

**Bonnes pratiques :**
- Documentez votre code et vos fonctions avec des commentaires clairs
- Ajoutez des tests unitaires et d'intégration si nécessaire
- Respectez la structure du projet
- Privilégiez la clarté, la simplicité et la robustesse

## Remerciements
Merci à @etalab, @yohanboniface, @cquest pour leur inspiration et leur travail. Une partie du code provient de [@etalab/adresse.data.gouv.fr](https://github.com/etalab/adresse.data.gouv.fr).

## Licence

Copyright (c) 2014-2018, Julien Noblet

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
