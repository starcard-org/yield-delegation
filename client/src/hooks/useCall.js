import {useContext, useEffect, useState} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useCall = (name, method, defaultValue = null, params) => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!drizzle || !initialized || !drizzle.contracts[name]) {
      return;
    }

    (async () => {
      let executor = drizzle.contracts[name].methods[method];
      try {
        const result = await (params ? executor(params).call() : executor().call());
        console.log(`[${method}-${name}]: ${result}`);
        setValue(result);
      } catch (e) {
        console.error(e);
        console.log(
          `drizzle.contracts[${name}].methods[${method}](${params}).call(): Error`
        );
      }
    })();
  }, [drizzle, initialized, name, method, params]);

  return [value];
};
