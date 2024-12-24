import { Button, Space, SearchBar, Grid } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getCurrentMenuList } from '@/services/base';
import DatePicker from './components/DatePicker';
import MenuPicker from './components/MenuPicker';
import Content from './components/Content';
import { MENU_MAP } from './constants';
import { getDefaultDate, getDefaultMenuType } from './utils';
import styles from './index.less';

const PageHome = () => {
  const [currentDate, setCurrentDate] = useState(getDefaultDate);
  const [currentSearch, setCurrentSearch] = useState('');
  const [currentMenuType, setCurrentMenuType] =
    useState<API_BASE.MenuType>(getDefaultMenuType);

  const [dataSource, setDataSource] = useState<API_BASE.GetEatMenuListData[]>(
    [],
  );

  const handleEdit = useCallback(
    (menu_type: string) => {
      history.push('/edit', {
        menu_type: menu_type || currentMenuType || getDefaultMenuType(),
        date: currentDate.format('YYYY-MM-DD'),
      });
    },
    [currentMenuType, currentDate],
  );

  const fetchData = () => {
    const date = currentDate.format('YYYY-MM-DD');
    getCurrentMenuList({
      content: currentSearch,
      menu_type: currentMenuType,
      date: `${date},${date}`,
    }).then((data) => {
      setDataSource(data.list || []);
    });
  };

  useEffect(() => {
    fetchData();
  }, [currentDate, currentSearch, currentMenuType]);

  return (
    <div className={styles['home']}>
      <div className={styles['home-title']}>今天吃什么</div>
      <div className={styles['home-sub-title']}>
        <Space align="center">
          <DatePicker value={currentDate} onChange={setCurrentDate} />
          <MenuPicker value={currentMenuType} onChange={setCurrentMenuType} />
        </Space>
        {/* <div className={styles['home-sub-title-search']}>
          <SearchBar
            placeholder="请输入内容以搜索"
            defaultValue={currentSearch}
            onSearch={setCurrentSearch}
          />
        </div> */}
      </div>
      <div className={styles['home-content']}>
        <Content value={dataSource} onChange={fetchData} />
      </div>
      <div className={styles['home-footer']}>
        <Grid columns={2} gap={8}>
          {MENU_MAP.map((item) => {
            const { label, value, status } = item;
            return (
              <Grid.Item>
                <Button
                  block
                  onClick={handleEdit.bind(null, value)}
                  color={status as any}
                >
                  新增{label}
                </Button>
              </Grid.Item>
            );
          })}
          <Grid.Item span={2}>
            <Button disabled block color='primary'>
              随机生成
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    </div>
  );
};

export default PageHome;
