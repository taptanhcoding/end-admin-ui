
import  {Layout,Table,Menu} from 'antd'
import React from 'react'
import SiderFillter from '../SiderFilter/SiderFillter'

export default function ContentHandle({itemsFilter=[],itemsAction=[],columns=[],rowSelection,dataTable,pagination}) {
  const { Sider, Content, Header } = Layout;

  return (
    <Layout>
    <SiderFillter items={itemsFilter} />
    <Content>
      <Layout>
        <Header style={{background: '#fff'}}>
          <Menu theme='light' mode="horizontal" items={itemsAction} />
        </Header>
        <Content>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataTable}
            pagination={pagination}
          />
        </Content>
      </Layout>
    </Content>
  </Layout>
  )
}
