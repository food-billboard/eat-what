import { Picker } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { history } from 'umi'
import { getCurrentMenuClassifyList } from '@/services/base';
import { MENU_LABEL_MAP } from '../../../Home/constants'
import styles from './index.less';

const ClassifyPicker = (props: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean
}) => {

  const {  menu_type } = (history.location.state || {}) as any

  const { value, onChange, disabled=false } = props;

  const [dataSource, setDataSource] = useState<
    { label: string; value: string }[]
  >([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function fetchData() {
      getCurrentMenuClassifyList({
        currPage: 0,
        pageSize: 999,
        menu_type
      }).then((data) => {
        setDataSource(
          data.list.map((item: any) => {
            return {
              label: `${item.title}（${MENU_LABEL_MAP[item.menu_type]}）`,
              value: item._id,
            };
          }),
        );
      });
    }
    fetchData();
  }, []);

  return (
    <div className={styles['classify-picker']}>
      <Picker
        title="选择菜单"
        visible={visible}
        onConfirm={(value) => {
          onChange?.(value?.[0] as string);
          setVisible(false)
        }}
        columns={[dataSource]}
        value={value ? [value] : []}
        onCancel={() => setVisible(false)}
      >
        {(value) => {
          return (
            <div onClick={() => {
              if(disabled) return 
              setVisible(true)
            }}>
              {value?.[0]?.label || (
                <span style={{ color: '#ccc' }}>选择菜单</span>
              )}
            </div>
          );
        }}
      </Picker>
    </div>
  );
};

export default ClassifyPicker;
