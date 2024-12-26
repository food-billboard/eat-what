import { Button, Space, SearchBar, Grid } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import { getCurrentMenuList } from '@/services/base';
import DatePicker from './components/DatePicker';
import MenuPicker from './components/MenuPicker';
import Content from './components/Content';
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
    () => {
      history.push('/edit', {
        menu_type: currentMenuType || getDefaultMenuType(),
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
      const { list } = data
      const result: {
        [key: string]: API_BASE.GetEatMenuListData[]
      } = {
        BREAKFAST: [],
        LUNCH: [],
        DINNER: [],
        NIGHT_SNACK: []
      }
      for(let i = 0; i < list.length; i ++) {
        const target: any = list[i]
        result[target.menu_type].push(target)
      }
      setDataSource([
        ...result.BREAKFAST,
        ...result.LUNCH,
        ...result.DINNER,
        ...result.NIGHT_SNACK,
      ]);
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
        <Grid.Item>
          <Button
            block
            onClick={handleEdit}
            color="primary"
          >
            新增菜单
          </Button>
        </Grid.Item>
          <Grid.Item>
            <Button onClick={() => history.push('/random')} block color='primary'>
              随机生成
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    </div>
  );
};

export default PageHome;
