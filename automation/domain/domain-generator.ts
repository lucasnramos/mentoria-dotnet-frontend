import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { DomainGeneratorGeneratorSchema } from './schema';

export async function domainGeneratorGenerator(
  tree: Tree,
  options: DomainGeneratorGeneratorSchema
) {
  const projectRoot = `src/domain/${options.name}`;
  const _names = names(options.name);
  generateFiles(tree, path.join(__dirname, 'files/src'), projectRoot, _names);
  await formatFiles(tree);
}

export default domainGeneratorGenerator;
