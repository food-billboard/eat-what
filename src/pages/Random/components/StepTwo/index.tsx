import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Collapse } from 'antd-mobile';
import { DeleteOutline } from 'antd-mobile-icons';
import { useUpdate } from 'ahooks'
import { postCurrentMenu, getRandomMenu } from '@/services/base';
import FormItem from '../FormItem';
import DatePicker from '../../../Home/components/DatePicker';
import { getDefaultDate } from '../../../Home/utils';
import styles from './index.less';

export type Value = {
  label: string;
  key: string;
  value: API_BASE.GetEatMenuClassifyListData[];
};

const StepTwo = (props: {
  value?: Value[];
  onChange?: (value: Value[]) => void;
  onFinish?: () => void;
}) => {
  const { value = [], onChange, onFinish: propsOnFinish } = props;

  const [date, setDate] = useState(getDefaultDate());

  const update = useUpdate()

  const values = useRef<Value[]>([])

  const onFinish = useCallback(() => {
    postCurrentMenu(
      value.reduce<API_BASE.PostEatMenuData[]>((acc, cur) => {
        acc.push(...cur.value.map(item => {
          return {
            date: date.format('YYYY-MM-DD'),
            menu_type: cur.key.toUpperCase() as API_BASE.MenuType,
            classify: item._id,
            description: item.description
          }
        }))
        return acc 
      }, [])
    )
    .then(propsOnFinish);
  }, [value, date, propsOnFinish]);

  const handleAdd = useCallback((type: string, ignoreMenu: string) => {
    getRandomMenu({
      breakfast: 0, 
      lunch: 0, 
      dinner: 0, 
      night_snack: 0,
      [type]: 1,
      ignore: ignoreMenu
    })
    .then((value: any) => {
      const target = value[type] 
      const index = values.current.findIndex(item => item.key === type)
      values.current[index].value.unshift(...target)
      update()
    })
  }, [])

  useEffect(() => {
    values.current = value 
    update()
  }, [value])  

  return (
    <div className={styles['step-two']}>
      <div className={styles['step-two-header']}>
        <DatePicker value={date} onChange={setDate} />
      </div>
      <div className={styles['step-two-main']}>
        {values.current.map((item, index) => {
          const { label, value, key } = item;
          return (
            <div key={key} className={styles['step-two-main-content']}>
              <div className={styles['step-two-main-content-title']}>
                {label}
                <Button size="small" color='primary' fill="outline" onClick={handleAdd.bind(null, key, value.map(item => item._id).join(','))}>新增</Button>
              </div>
              <Collapse accordion>
                {value.map((item, subIndex) => {
                  const { _id, title } = item;
                  const parent = values.current[index]
                  return (
                    <Collapse.Panel key={_id} title={(
                      <div>
                        {title}
                        <span style={{marginLeft: '1rem'}}  onClick={e => {
                          e.stopPropagation()
                          parent.value.splice(subIndex, 1)
                          values.current[index] = {...parent}
                          update()
                        }}>
                          <DeleteOutline color='var(--adm-color-danger)' />
                        </span>
                      </div>
                    )}>
                      <FormItem 
                        value={item} 
                        onChange={(_, value) => {
                          parent.value[subIndex] = {
                            ...parent.value[subIndex],
                            ...value 
                          }
                          values.current[index] = {...parent}
                        }} 
                      />
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            </div>
          );
        })}
      </div>
      <div className={styles['step-two-footer']}>
        <Button block color="primary" onClick={onFinish}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
