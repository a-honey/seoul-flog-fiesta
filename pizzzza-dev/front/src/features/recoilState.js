import { atom } from 'recoil';

export const isErrorState = atom({
  key: 'isError',
  default: false,
});

export const errorMessageState = atom({
  key: 'errorMessage',
  default: '',
});
