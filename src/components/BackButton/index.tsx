import { Button } from 'antd-mobile';
import type { ButtonProps } from 'antd-mobile'
import { useCallback } from 'react';
import { history } from 'umi';

const BackButton = (props: Partial<ButtonProps>) => {
  const handleBack = useCallback(() => {
    history.replace('/');
  }, []);

  return (
    <Button block color="primary" fill="outline" {...props} onClick={handleBack}>
      返回
    </Button>
  );
};

export default BackButton;
