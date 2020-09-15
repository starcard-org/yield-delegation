import {useContext, useEffect, useState} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useCall = (name, method, defaultValue = null, params) => {
  const {drizzle, loading} = useContext(DrizzleContext);
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (!drizzle || loading) {
      return;
    }

    (async () => {
      console.log(`Name: ${name}`);
      console.log(`Method: ${method}`);

      let executor = drizzle.contracts[name].methods[method];

      const result = await (params ? executor(params).call() : executor().call());

      console.log(`Result[${name}.${method}]: ${result}`);
      setValue(result);
    })();
  }, [drizzle, loading, name, method, params]);

  return [value];
};
