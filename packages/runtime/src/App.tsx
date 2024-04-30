import { useEffect } from 'react';

import routes from './routes';

import config from '@/config';

import './App.css';

function App() {
  useEffect(() => {
    console.log(config.title, config.version);
    console.log(routes);
  }, []);

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <></>;
}

export default App;
