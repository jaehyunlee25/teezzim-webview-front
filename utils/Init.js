import { useState, useEffect } from 'react';

export const Init = () => {
  const test = () => {
    console.log('Init');
  };

  return { test };
};
