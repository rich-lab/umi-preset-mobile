import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export default ({ root }: { root: string }) => {
  return readdirSync(root)
    .filter((dir) => dir.charAt(0) !== '.')
    .filter((dir) => statSync(join(root, dir)).isDirectory());
};
