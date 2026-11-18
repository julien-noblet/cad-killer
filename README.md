# cad-killer

Visionneur de carte pour logisticiens pressés

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Donate using Liberapay](https://liberapay.com/assets/widgets/donate.svg)](https://liberapay.com/Julien_N/donate)

Consultable ici : <http://julien-noblet.github.io/cad-killer/>

Un grand merci a @etalab, @yohanboniface, @cquest sans qui ce projet n'existerai pas.
Une grande partie de ce code vient de @etalab/adresse.data.gouv.fr

## Développement

Ce projet utilise [devenv](https://devenv.sh/) pour fournir un environnement reproductible (Node.js, Bun, Chromium, `treefmt` et `git-hooks`).

```sh
devenv shell   # Entre dans le shell de développement et installe les dépendances + git-hooks
devenv up      # Lance le serveur Next.js (port 9000) et tsc --watch en parallèle
devenv test    # Exécute les git-hooks, le lint, le typecheck, le build et les tests unitaires
```

## Scripts

- `bun run dev` (ou `devenv up`) : lance le serveur local sur `http://localhost:9000/cad-killer/`
- `bun run build` (ou `devenv tasks run cad-killer:build`) : build Next.js statique (`out/`)
- `bun run lint` : exécute ESLint, Stylelint et Prettier
- `bun run typecheck` : vérification statique TypeScript
- `bun run test:unit` : exécute les tests unitaires Jest
- `bun run test:e2e` (ou `bunx playwright test --project=chromium` sous NixOS) : exécute les tests E2E Playwright
- `bun run test:e2e:update` : met à jour les snapshots visuels Playwright
- `treefmt` : formate le dépôt (Prettier, `nixfmt`, `shfmt`)
- `devenv test` : valide l'environnement complet (hooks, lint, typecheck, build, tests unitaires)

## Licence

Copyright (c) 2014-2018, Julien Noblet <Julien.Noblet@gmail.com>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
