import { join } from 'path';
import getDirs from './getDirs';

export default function (opts: { root: string }) {
  const pluginsDir = join(opts.root, 'plugins');
  return getDirs({
    root: join(pluginsDir),
  }).map((dir) => require.resolve(join(pluginsDir, dir, 'index')));
}
