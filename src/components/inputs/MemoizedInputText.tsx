import React from 'react';
import InputText from './InputText';

const MemoizedInputText = React.memo(InputText, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.invalid === next.invalid &&
    prev.placeholder === next.placeholder
  );
});

export default MemoizedInputText;
