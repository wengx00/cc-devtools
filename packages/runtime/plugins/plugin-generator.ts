import packageJson from '../package.json';

export default function pluginGenerator() {
  return {
    name: 'plugin-generator',
    enforce: 'pre' as const,

    resolveId(id: string) {
      if (id === 'app-version') return id;
      return null;
    },

    load(id: string) {
      if (id !== 'app-version') return null;
      const { version } = packageJson;
      return `const VERSION = '${version}'\nexport default VERSION\n`;
    },
  };
}
