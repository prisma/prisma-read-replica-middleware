import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'cjs',
    sourcemap: false,
  },
  plugins: [
    typescript({
      compilerOptions: {
        noEmit: false,
        module: 'esnext',
        incremental: false,
      },
    }),
    terser(),
  ],
  external: ['../prisma/read-replica-client']
}
