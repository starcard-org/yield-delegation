import {useCallback, useContext, useEffect, useState} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useCall = (name, method, defaultValue = null, params = null) => {
  const {drizzle, initialized} = useContext(DrizzleContext);
  const [value, setValue] = useState(defaultValue);

  const execute = useCallback(async () => {
    let executor = drizzle.contracts[name].methods[method];
    try {
      const result = await (params !== null
        ? executor(...(Array.isArray(params) ? params : [params])).call()
        : executor().call());
      console.log(`[${method}-${name}]: ${result}`);
      setValue(result);
    } catch (e) {
      console.error(e);
      console.log(
        `drizzle.contracts[${name}].methods[${method}](${params}).call(): Error`
      );
    }
  }, [drizzle, name, method, params]);

  useEffect(() => {
    if (!drizzle || !initialized || !drizzle.contracts[name]) {
      return;
    }

    execute();
  }, [drizzle, initialized, name, execute]);

  return [value, execute];
};
