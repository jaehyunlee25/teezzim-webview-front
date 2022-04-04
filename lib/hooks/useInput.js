import { useState, useEffect } from 'react';

export default function useInput(initialState, { onChangeCondition, cb } = {}) {
  const [inputs, setInputs] = useState(initialState || {});
  const handleChange = e => {
    const { name, value } = e.target;
    if (onChangeCondition) {
      const result = onChangeCondition(name, value);
      if (result !== false) setInputs({ ...inputs, [name]: result });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
    if (cb) cb({ name, value });
  };

  const reset = () => {
    setInputs(initialState);
  };

  useEffect(() => {
    setInputs(initialState);
  }, []);

  return { inputs, setInputs, handleChange, reset };
}
