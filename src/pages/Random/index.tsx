import { useCallback, useState } from 'react';
import { Toast } from 'antd-mobile';
import { history } from 'umi';
import StepOne from './components/StepOne';
import StepTwo, { Value } from './components/StepTwo';
import styles from './index.less'

const Random = () => {
  const [step, setStep] = useState(0);
  const [requestValue, setRequestValue] = useState<Value[]>([]);

  const onStepOneFinish = useCallback((value: any) => {
    const { breakfast, lunch, dinner, night_snack } = value;
    setRequestValue([
      {
        label: '早餐',
        key: 'breakfast',
        value: breakfast.map((item: any) => {
          return {
            ...item,
            menu_type: 'BREAKFAST',
            classify: item._id 
          }
        }),
      },
      {
        label: '午餐',
        key: 'lunch',
        value: lunch.map((item: any) => {
          return {
            ...item,
            menu_type: 'LUNCH',
            classify: item._id 
          }
        }),
      },
      {
        label: '晚餐',
        key: 'dinner',
        value: dinner.map((item: any) => {
          return {
            ...item,
            menu_type: 'NIGHT',
            classify: item._id 
          }
        }),
      },
      {
        label: '夜宵',
        key: 'night_snack',
        value: night_snack.map((item: any) => {
          return {
            ...item,
            menu_type: 'NIGHT_SNACK',
            classify: item._id 
          }
        }),
      },
    ]);
    setStep(1);
  }, []);

  const onStepTwoFinish = useCallback(() => {
    Toast.show({
      content: '操作成功~',
      afterClose: () => {
        history.go(-1);
      },
    });
  }, []);

  return (
    <div className={styles['random']}>
      {step === 0 && <StepOne onFinish={onStepOneFinish} />}
      {step === 1 && (
        <StepTwo
          value={requestValue}
          onChange={setRequestValue}
          onFinish={onStepTwoFinish}
        />
      )}
    </div>
  );
};

export default Random;
