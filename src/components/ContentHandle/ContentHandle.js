
import  {Layout,Table,Menu} from 'antd'
import React from 'react'
import SiderFillter from '../SiderFilter/SiderFillter'

export default function ContentHandle({itemsFilter=[],itemsAction=[],columns=[],rowSelection,dataTable,pagination,tableScroll=false}) {
  const { Sider, Content, Header } = Layout;
  const scroll = tableScroll ? {scroll:{x: 1500}} : {}
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
            {...scroll}
          />
        </Content>
      </Layout>
    </Content>
  </Layout>
  )
}
