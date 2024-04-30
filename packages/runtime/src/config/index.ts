import version from 'app-version';

const {
  VITE_API_PREFIX: apiPrefix,
  VITE_APP_AUTHOR: author,
  VITE_APP_DESCRIPTION: description,
  VITE_APP_TITLE: title,
  VITE_BASE: base,
  VITE_DEV_PORT: devPort,
} = import.meta.env;

export default {
  version,
  apiPrefix,
  author,
  description,
  title,
  base,
  devPort,
};
