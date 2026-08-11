// Lets `node --test` run the TypeScript sources directly. Node strips types on
// its own, but it resolves ESM specifiers literally — it doesn't read
// tsconfig's `paths`, and it won't guess a missing extension. This hook maps
// the `@/…` alias onto `src/…` and appends `.ts`.
import { registerHooks } from "node:module";

const SRC = new URL("../src/", import.meta.url);

registerHooks({
  resolve(specifier, context, next) {
    if (!specifier.startsWith("@/")) return next(specifier, context);

    const path = specifier.slice(2);
    return next(new URL(path.endsWith(".ts") ? path : `${path}.ts`, SRC).href, context);
  },
});
