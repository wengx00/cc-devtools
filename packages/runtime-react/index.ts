export {
  type LazyModule,
  type Route,
  progressiveInsertRoute,
  getRoutes,
} from '@/routes';

export {
  FormContext,
  FormStore,
  type FormControlProtocol,
  type FormSubscriber,
} from '@/utils/form-utils';

export { getApiHook } from '@/utils/get-hooks';

export {
  type FormItemProtocol,
  default as useFormItem,
} from '@/hooks/useFormItem';

export { default as pluginGenerator } from './plugins/plugin-generator';

export {
  Form,
  FormItem,
  FormLabel,
  routesRenderer,
  ScaffoldRoutes,
  type FormProps,
  type FormItemProps,
  type FormRef,
  type FormRule,
  type FormRules,
} from '@/components';
