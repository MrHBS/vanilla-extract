import deepmerge from 'deepmerge';
import { appendCss } from './adapter';
import { getFileScope } from './fileScope';
import { generateIdentifier } from './identifier';

type LayerOptions = {
  commit?: boolean;
  parent?: string;
};
const defaultLayerOptions: LayerOptions = {
  commit: true,
};

const getLayerArgs = <TOptions extends LayerOptions>(...args: any[]): [TOptions, string] => {
  let options = defaultLayerOptions;
  let debugId: string = args[0];

  if (typeof args[0] === 'object') {
    options = deepmerge(defaultLayerOptions, args[0]);
    debugId = args[1];
  }

  return [options as TOptions, debugId];
};

export function layer(options: LayerOptions, debugId?: string): string;
export function layer(debugId?: string): string;
export function layer(...args: any[]): string {
  const [options, debugId] = getLayerArgs<LayerOptions>(...args);

  let name = generateIdentifier(debugId);
  if (options.parent) {
    name = `${options.parent}.${name}`;
  }

  if (options.commit) {
    appendCss({ type: 'layer', name }, getFileScope());
  }

  return name;
}

type GlobalLayerOptions = Omit<LayerOptions, 'parent'>;

export function globalLayer(options: GlobalLayerOptions, name: string): string;
export function globalLayer(name: string): string;
export function globalLayer(...args: any[]): string {
  const [options, name] = getLayerArgs<GlobalLayerOptions>(...args);

  if (options.commit) {
    appendCss({ type: 'layer', name }, getFileScope());
  }

  return name;
}

export function commitLayers(names: string[]) {
  appendCss({ type: 'layer', name: names.join(', ') }, getFileScope());
}
