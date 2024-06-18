import Param from './param';

export default function Body(id?: string): ParameterDecorator {
  return Param('body', id);
}
