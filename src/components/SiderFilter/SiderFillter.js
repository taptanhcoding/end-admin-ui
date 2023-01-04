

import React from 'react'
import {Layout,Menu} from 'antd'

export default function SiderFillter({items}) {
    const {Sider} = Layout
  return (
    <Sider theme='light'>
        <Menu 
        theme='light'
        mode='inline'
        items={items}
        />
    </Sider>
  )
}
