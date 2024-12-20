import { 
  Space, 
  Swiper, 
  Tag, 
  Button,
  ErrorBlock
} from 'antd-mobile';
import { useCallback } from 'react';
import { history } from 'umi';
import { MENU_MAP } from '../../constants';
import styles from './index.less';

const Content = (props: {
  value: API_BASE.GetMenuListData[];
  onChange?: () => any;
}) => {
  const { value } = props;

  const handleCopy = useCallback((value: string, e: any) => {
    e.stopPropagation();
    history.push('/edit', {
      value,
      type: 'copy',
    });
  }, []);

  const handleDetail = useCallback((value: string) => {
    history.push('/edit', {
      value,
      type: 'detail',
    });
  }, []);

  return (
    <div className={styles['content']}>
      {
        value.length ? (
          <Swiper slideSize={70} trackOffset={15} loop stuckAtBoundary={false}>
        {value.map((item) => {
          const { title, description, menu_type, _id, content } = item;
          const targetMenu = MENU_MAP.find((item) => item.value === menu_type);
          const color = targetMenu?.color || 'default';
          return (
            <Swiper.Item key={_id} onClick={handleDetail.bind(null, _id)}>
              <div className={styles['content-item']}>
                <div className={styles['content-title']}>
                  <div>{title}</div>
                  <Tag color={color}>{targetMenu?.label || '-'}</Tag>
                </div>
                <div className={styles['content-description']}>
                  {description}
                </div>
                <div
                  className={styles['content-main']}
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                />
                <div className={styles['content-footer']}>
                  <Space align="end">
                    <Button color='primary' fill="outline" size="mini" onClick={handleCopy.bind(null, _id)}>复制</Button>
                  </Space>
                </div>
              </div>
            </Swiper.Item>
          );
        })}
      </Swiper>
        )
        :
        (
          <ErrorBlock
            status='empty'
            title="当天还没有添加菜单哦"
            description="试着先添加菜单吧~"
          />
        )
      }
      
    </div>
  );
};

export default Content;
