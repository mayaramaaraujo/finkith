// Lets `node --test` run the TypeScript sources directly. Node strips types on
// its own, but it resolves ESM specifiers literally — it doesn't read
// tsconfig's `paths`, it won't guess a missing extension, and it won't look
// for a directory's index. This hook maps the `@/…` alias onto `src/…` and
// supplies both.
import { existsSync } from "node:fs";
import { registerHooks } from "node:module";

const SRC = new URL("../src/", import.meta.url);

function resolveFile(path) {
  if (path.endsWith(".ts")) return new URL(path, SRC);

  const asFile = new URL(`${path}.ts`, SRC);
  // `@/shared/lib/i18n/dictionaries` is a directory whose index re-exports
  // every locale, so a bare `.ts` guess misses it.
  return existsSync(asFile) ? asFile : new URL(`${path}/index.ts`, SRC);
}

registerHooks({
  resolve(specifier, context, next) {
    if (!specifier.startsWith("@/")) return next(specifier, context);

    return next(resolveFile(specifier.slice(2)).href, context);
  },
});
