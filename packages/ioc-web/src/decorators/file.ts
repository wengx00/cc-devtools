import Param from './param';

export default function File(id?: string): ParameterDecorator {
  return Param('file', id);
}
