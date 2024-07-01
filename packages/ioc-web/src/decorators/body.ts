import Param from './param';

export default function Body(
  id?: string,
  options?: {
    pipelines?: ((x: any) => any)[];
  },
): ParameterDecorator {
  return Param('body', id, options);
}
