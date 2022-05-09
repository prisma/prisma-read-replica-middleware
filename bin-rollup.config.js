import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/bin/prisma-read-replica.ts',
  output: {
    dir: 'dist/bin',
    format: 'cjs',
    sourcemap: false,
    banner: "#!/usr/bin/env node"
  },
  plugins: [
    typescript({
      compilerOptions: {
        noEmit: false,
        module: 'esnext',
        incremental: false,
        outDir: 'dist/bin'
      },
    }),
    terser(),
  ],
}
