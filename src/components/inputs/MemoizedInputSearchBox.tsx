import React from 'react';
import InputSearchBox from './InputSearchBox';

const MemoizedInputSearchBox = React.memo(InputSearchBox, (prev, next) => {
  return (
    prev.value === next.value &&
    prev.disabled === next.disabled &&
    prev.invalid === next.invalid &&
    prev.placeholder === next.placeholder
  );
});

export default MemoizedInputSearchBox;
