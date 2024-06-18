import Param from './param';

export default function Query(id?: string): ParameterDecorator {
  return Param('query', id);
}
