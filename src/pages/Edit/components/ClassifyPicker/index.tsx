import { Picker } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons'
import { useEffect, useMemo, useState } from 'react';
import { getCurrentMenuClassifyList } from '@/services/base';
import RichEditor from '@/components/Editor';
import styles from './index.less';

const ClassifyPicker = (props: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean
  menu_type?: string[]
}) => {

  const { value, onChange, disabled=false, menu_type='' } = props;

  const [dataSource, setDataSource] = useState<
    { label: string; value: string, content: string }[]
  >([]);
  const [visible, setVisible] = useState(false);

  const currentContent = useMemo(() => {
    return dataSource.find(item => item.value === value)?.content || '' 
  }, [dataSource, value])

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
              ...item,
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
            <div 
              onClick={() => {
                if(disabled) return 
                setVisible(true)
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              {value?.[0]?.label || (
                <span style={{ color: '#ccc' }}>选择菜单</span>
              )}
              <RightOutline color="var(--adm-color-light)" style={{fontSize: 19}} />
            </div>
          );
        }}
      </Picker>
      <div className={styles['classify-picker-content']}>
        <RichEditor value={currentContent} toolbarVisible={false} disabled defaultConfig={{
          placeholder: '这里显示菜单的内容'
        }} />
      </div>
    </div>
  );
};

export default ClassifyPicker;
