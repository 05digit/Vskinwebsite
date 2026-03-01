import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

/**
 * figmaMakeCompat — resolves two Figma Make-specific import conventions:
 *
 * 1. Versioned package specifiers
 *    Figma Make allows `import x from "pkg@1.2.3"` as a shorthand to pin
 *    versions at dev time.  In a standard Vite build those imports fail because
 *    no module named "pkg@1.2.3" exists in node_modules.  This plugin strips
 *    the version suffix so the import is redirected to the plain "pkg" package
 *    that IS installed.
 *    Examples:
 *      sonner@2.0.3            → sonner
 *      react-hook-form@7.55.0  → react-hook-form
 *      @radix-ui/react-slot@1.1.2 → @radix-ui/react-slot
 *
 * 2. figma:asset virtual module
 *    Figma Make exposes imported Figma raster assets through the virtual scheme
 *    `figma:asset/<hash>.png`.  In the Figma Make preview environment these are
 *    resolved natively — so we leave them ALONE in development mode.
 *    During a production build (e.g. `vite build` for Vercel) there is no Figma
 *    Make runtime, so we stub them to an empty string to prevent build errors.
 *    To show real images in the deployed build, copy your product photos into
 *    /public/images/ and update the src values in data/products.ts accordingly.
 */
function figmaMakeCompat(): Plugin {
  const VERSIONED_RE = /^((?:@[^/@]+\/)?[^@/][^/@]*)@\d[\d.]*(.*)$/;

  return {
    name: 'figma-make-compat',

    async resolveId(id, importer) {
      // 1. Strip version suffix and re-resolve through the normal pipeline
      const m = id.match(VERSIONED_RE);
      if (m) {
        const clean = m[1] + (m[2] ?? '');
        return this.resolve(clean, importer, { skipSelf: true });
      }

      // 2. Virtual module for figma:asset — ONLY during production builds.
      //    In dev/Figma Make preview the runtime resolves these natively;
      //    intercepting them here would blank out the images in the preview.
      if (id.startsWith('figma:asset/') && process.env.NODE_ENV === 'production') {
        return '\0' + id;
      }
    },

    load(id) {
      if (id.startsWith('\0figma:asset/')) {
        // Stub: returns an empty src so the build succeeds.
        // Replace with real /public paths or CDN URLs for a live deployment.
        return `export default ""`;
      }
    },
  };
}

export default defineConfig({
  plugins: [
    figmaMakeCompat(),
    react(),
    tailwindcss(),
  ],
});
