import {useContext, useEffect, useState} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useCall = (name, method, defaultValue = null, params) => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!drizzle || !initialized) {
      return;
    }

    console.log(`Calling ${method} for ${name}`);
    (async () => {
      let executor = drizzle.contracts[name].methods[method];

      const result = await (params ? executor(params).call() : executor().call());

      console.log(`[${method}-${name}]: ${result}`);
      setValue(result);
    })();
  }, [drizzle, initialized, name, method, params]);

  return [value];
};
