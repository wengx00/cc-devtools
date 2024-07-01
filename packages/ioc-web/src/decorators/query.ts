import Param from './param';

export default function Query(
  id?: string,
  options?: {
    pipelines?: ((x: any) => any)[];
  },
): ParameterDecorator {
  return Param('query', id, options);
}
