import { Picker } from 'antd-mobile';
import { useEffect, useState } from 'react';
import { getCurrentMenuClassifyList } from '@/services/base';
import styles from './index.less';

const ClassifyPicker = (props: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean
  menu_type?: string[]
}) => {

  const { value, onChange, disabled=false, menu_type='' } = props;

  const [dataSource, setDataSource] = useState<
    { label: string; value: string }[]
  >([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function fetchData() {
      getCurrentMenuClassifyList({
        currPage: 0,
        pageSize: 999,
        menu_type: menu_type?.[0] as API_BASE.MenuType || ''
      }).then((data) => {
        setDataSource(
          data.list.map((item: any) => {
            return {
              label: item.title,
              value: item._id,
            };
          }),
        );
      });
    }
    fetchData();
  }, [menu_type]);

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
