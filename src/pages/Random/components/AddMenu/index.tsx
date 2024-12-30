import { Picker, Button } from 'antd-mobile';
import { useEffect, useMemo, useState } from 'react';
import { getCurrentMenuClassifyList } from '@/services/base';

const AddButton = (props: {
  type: API_BASE.MenuType 
  ignoreMenu: string[]
  onAdd?: (
    value: API_BASE.GetEatMenuClassifyListData,
  ) => void;
}) => {
  const { type, ignoreMenu, onAdd } = props;

  const [_dataSource, setDataSource] = useState<
    ({ label: string; value: string } & API_BASE.GetEatMenuClassifyListData)[]
  >([]);
  const [visible, setVisible] = useState(false)

  const dataSource = useMemo(() => {
    return _dataSource.filter(item => {
      return !ignoreMenu.includes(item.value)
    })
  }, [_dataSource, ignoreMenu])

  useEffect(() => {
    getCurrentMenuClassifyList({
      menu_type: type,
      currPage: 0,
      pageSize: 999
    })
    .then((data) => {
      setDataSource(
        data.list.map((item: any) => {
          return {
            ...item,
            label: item.title,
            value: item._id,
          };
        }),
      );
    })
  }, [type])

  return (
    <>
      <Button size="small" color='primary' fill='outline' onClick={() => setVisible(true)}>
        新增自定义菜单
      </Button>
      <Picker
        title='菜单选择'
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        columns={[dataSource]}
        onConfirm={(val, extend) => {
          const [pickerValue] = extend.items
          if(pickerValue) onAdd?.(pickerValue as any)
            setVisible(false)
        }}
      />
    </>
  )
};

export default AddButton;
