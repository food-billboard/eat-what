import { Button, Space, Grid } from 'antd-mobile';
import { useCallback, useEffect, useState } from 'react';
import { history } from 'umi';
import dayjs from 'dayjs';
import { useSetState } from 'ahooks'
import { getCurrentMenuList } from '@/services/base';
import DatePicker from './components/DatePicker';
import MenuPicker from './components/MenuPicker';
import Content from './components/Content';
import { getDefaultDate, getDefaultMenuType } from './utils';
import styles from './index.less';

type GlobalValue = {
  currentDate: dayjs.Dayjs
  currentSearch: string,
  currentMenuType: API_BASE.MenuType
}

const GLOBAL_SEARCH_PARAMS: GlobalValue = {
  currentDate: getDefaultDate(),
  currentSearch: '',
  currentMenuType: getDefaultMenuType()
}

const PageHome = () => {
  const [ state, _setState ] = useSetState<typeof GLOBAL_SEARCH_PARAMS>({...GLOBAL_SEARCH_PARAMS})

  const {  
    currentDate,
    currentSearch,
    currentMenuType
  } = state

  const [dataSource, setDataSource] = useState<API_BASE.GetEatMenuListData[]>(
    [],
  );

  function setState<T extends keyof GlobalValue>(key: T, value: GlobalValue[T]) {
    GLOBAL_SEARCH_PARAMS[key] = value 
    _setState({...GLOBAL_SEARCH_PARAMS})
  }

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
          <DatePicker value={currentDate} onChange={setState.bind(null, 'currentDate')} />
          <MenuPicker value={currentMenuType} onChange={setState.bind(null, 'currentMenuType')} />
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
