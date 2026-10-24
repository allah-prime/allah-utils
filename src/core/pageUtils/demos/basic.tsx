import React, { useState } from 'react';
import { Button, Card, Descriptions, Space, message } from 'antd';
import { isLastPageData, buildPageConfig, type ITablePage } from '../index';

const BasicDemo = () => {
  // 模拟一个分页数据状态：当前在第2页，且只有1条数据
  const [pageData, setPageData] = useState<ITablePage<any>>({
    records: [{ id: 101, name: '最后一条数据' }],
    list: [], // 兼容字段
    current: 2,
    size: 10,
    total: 11,
    pages: 2,
  });

  const checkIsLast = () => {
    const isLast = isLastPageData(pageData);
    if (isLast) {
      message.warning('检测到这是当前页的最后一条数据！建议删除后跳转到上一页。');
    } else {
      message.info('当前页还有多条数据或处于第一页。');
    }
  };

  const config = buildPageConfig(pageData);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="场景演示：删除最后一条数据自动跳转">
        <Descriptions bordered column={1}>
          <Descriptions.Item label="当前页数">{pageData.current}</Descriptions.Item>
          <Descriptions.Item label="当前页数据量">{pageData.records.length}</Descriptions.Item>
          <Descriptions.Item label="总数据量">{pageData.total}</Descriptions.Item>
        </Descriptions>
        
        <div style={{ marginTop: 16 }}>
          <Button type="primary" danger onClick={checkIsLast}>
            模拟点击删除按钮（检测是否需回退页码）
          </Button>
        </div>
      </Card>

      <Card title="场景演示：生成 Ant Design 分页配置">
        <p>调用 <code>buildPageConfig</code> 生成的配置对象：</p>
        <pre style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      </Card>
    </Space>
  );
};

export default BasicDemo;
