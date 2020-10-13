import {useContext, useEffect, useState} from 'react';
import {DrizzleContext} from '../context/DrizzleContext';

export const useMethod = (contract, name) => {
  const {drizzle, loading} = useContext(DrizzleContext);
  const [method, setMethod] = useState(() => {});

  useEffect(() => {
    if (!drizzle || loading) {
      return;
    }

    setMethod(drizzle.contracts[contract].methods[name]);
  }, [drizzle, loading, contract, name]);

  return method;
};
