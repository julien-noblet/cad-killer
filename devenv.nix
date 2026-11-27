{
  pkgs,
  lib,
  ...
}:

let
  pkgJson = builtins.fromJSON (builtins.readFile ./package.json);

  node_modules = pkgs.stdenvNoCC.mkDerivation {
    pname = "${pkgJson.name}-node-modules";
    inherit (pkgJson) version;

    src = lib.fileset.toSource {
      root = ./.;
      fileset = lib.fileset.unions [
        ./package.json
        ./bun.lock
      ];
    };

    nativeBuildInputs = [
      pkgs.bun
      pkgs.cacert
    ];

    dontConfigure = true;
    dontFixup = true;

    buildPhase = ''
      runHook preBuild
      export HOME=$(mktemp -d)
      export SSL_CERT_FILE="${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt"
      bun install --frozen-lockfile --ignore-scripts --no-progress
      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall
      mkdir -p $out
      cp -r node_modules $out/node_modules
      runHook postInstall
    '';

    outputHashAlgo = "sha256";
    outputHashMode = "recursive";
    outputHash = "sha256-yfqKEpWttYwQlvXbYnnkyxfk0IWZxd/o3EHvo/Jw0Lo=";
  };

  site = pkgs.stdenvNoCC.mkDerivation {
    pname = pkgJson.name;
    inherit (pkgJson) version;

    src = lib.fileset.toSource {
      root = ./.;
      fileset = lib.fileset.unions [
        ./app
        ./src
        ./types
        ./public
        ./static
        ./package.json
        ./next.config.mjs
        ./next-env.d.ts
        ./tsconfig.json
        ./postcss.config.js
        ./.browserslistrc
      ];
    };

    nativeBuildInputs = [
      pkgs.bun
      pkgs.nodejs_24
    ];

    dontConfigure = true;

    buildPhase = ''
      runHook preBuild
      export HOME=$(mktemp -d)
      export NEXT_TELEMETRY_DISABLED=1
      cp -r --no-preserve=mode ${node_modules}/node_modules node_modules
      bun run build
      runHook postBuild
    '';

    installPhase = ''
      runHook preInstall
      cp -r out $out
      runHook postInstall
    '';
  };
in
{
  # https://devenv.sh/outputs/
  outputs = {
    inherit node_modules site;
  };

  # https://devenv.sh/basics/
  env = {
    NEXT_TELEMETRY_DISABLED = "1";
  };

  # https://devenv.sh/packages/
  packages = [
    pkgs.git
    pkgs.chromium
    pkgs.watchexec
    pkgs.bun
    pkgs.nodejs_24
  ];

  # https://devenv.sh/processes/
  processes = {
    dev = {
      exec = "bun run dev";
      ready.http.get = {
        port = 9000;
        path = "/cad-killer";
      };
    };

    typecheck = {
      exec = "bunx tsc --noEmit --watch --preserveWatchOutput";
    };
  };

  # https://devenv.sh/scripts/
  scripts = {
    dev.exec = "bun run dev";
    build.exec = "bun run build";
    check.exec = ''
      treefmt --ci
      bun run lint
      bun run typecheck
      bun run test:unit
    '';
    test-e2e.exec = "bunx playwright test --project=chromium";
  };

  # https://devenv.sh/basics/
  enterShell = ''
    if [ -d /run/current-system ] && [ -z "''${PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH:-}" ]; then
      export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="${lib.getExe pkgs.chromium}"
    fi
  '';

  # https://devenv.sh/tasks/
  tasks = {
    "cad-killer:install" = {
      exec = ''
        marker=".devenv/state/node_modules_store_path"
        if [ -L node_modules ] || [ ! -d node_modules ] || [ ! -f "$marker" ] || [ "$(cat "$marker")" != "${node_modules}" ]; then
          rm -rf node_modules
          cp -r --reflink=auto ${node_modules}/node_modules node_modules
          chmod -R u+w node_modules
          mkdir -p .devenv/state
          printf '%s' "${node_modules}" > "$marker"
        fi
      '';
      before = [
        "devenv:git-hooks:run"
        "devenv:enterTest"
      ];
    };
  };

  # https://devenv.sh/profiles/
  profiles.ci.module = {
    # https://devenv.sh/tasks/
    tasks = {
      "cad-killer:lint" = {
        exec = "bun run lint";
        after = [ "cad-killer:install" ];
      };

      "cad-killer:typecheck" = {
        exec = "bun run typecheck";
        after = [ "cad-killer:install" ];
      };

      "cad-killer:test:unit" = {
        exec = "bun run test:unit";
        after = [ "cad-killer:install" ];
      };

      "cad-killer:build" = {
        exec = "bun run build";
        after = [ "cad-killer:install" ];
      };

      "cad-killer:test:e2e" = {
        exec = "bun run test:e2e";
        after = [ "cad-killer:install" ];
      };

      "cad-killer:test:e2e:chromium" = {
        exec = "bunx playwright test --project=chromium";
        after = [ "cad-killer:install" ];
      };
    };
  };

  # https://devenv.sh/tests/
  enterTest = ''
    echo "Running cad-killer lint, typecheck, build, and unit tests..."
    bun run lint
    bun run typecheck
    bun run build
    bun run test:unit
  '';

  # https://devenv.sh/integrations/treefmt/
  treefmt = {
    enable = true;
    config = {
      programs = {
        nixfmt.enable = true;
        prettier.enable = true;
        shfmt.enable = true;
      };
      settings.global.excludes = [
        "bun.lock"
        "devenv.lock"
        "skills-lock.json"
        ".next/*"
        "out/*"
        "node_modules/*"
        "test-results/*"
        "playwright-report/*"
        "e2e/visual.spec.ts-snapshots/*"
      ];
    };
  };

  # https://devenv.sh/git-hooks/
  git-hooks.hooks = {
    treefmt.enable = true;
    actionlint.enable = true;
    deadnix.enable = true;
    statix.enable = true;
    check-yaml.enable = true;
    check-json.enable = true;

    end-of-file-fixer = {
      enable = true;
      excludes = [ "^(bun\\.lock|devenv\\.lock|skills-lock\\.json)$" ];
    };

    trim-trailing-whitespace = {
      enable = true;
      excludes = [ "^(bun\\.lock|devenv\\.lock|skills-lock\\.json)$" ];
    };

    eslint = {
      enable = true;
      name = "eslint";
      entry = "bunx eslint";
      files = "\\.(js|jsx|ts|tsx|mjs)$";
      pass_filenames = true;
    };

    stylelint = {
      enable = true;
      name = "stylelint";
      entry = "bun run lint:scss";
      files = "\\.scss$";
      pass_filenames = false;
    };

    typecheck = {
      enable = true;
      name = "typecheck";
      entry = "bun run typecheck";
      files = "\\.(ts|tsx)$";
      pass_filenames = false;
    };
  };
}
