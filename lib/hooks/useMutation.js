import { useState } from 'react';

import axios from 'axios';

const config = axios.create({
  // baseUrl: 'https://dev.mnemosyne.co.kr/teeapi',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

export const useMutation = url => {
  const [state, setState] = useState({
    loading: false,
    data: undefined,
    error: undefined,
  });

  const mutation = data => {
    setState(prev => ({ ...prev, loading: true }));
    axios({
      method: 'POST',
      url,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
      .then(data => setState(prev => ({ ...prev, data, loading: false })))
      .catch(error => setState(prev => ({ ...prev, error, loading: false })));
  };

  return [mutation, { ...state }];
};
