import React, { useEffect, useState } from "react";
import { PlusSquareOutlined, ControlOutlined, SyncOutlined } from '@ant-design/icons'
import { DatePicker, Space, Tag } from 'antd';
import { Form } from 'antd'
import axiosClient from '../../../libraries/axiosClient'
import formatMoney from "../../../libraries/formatMoney";

import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import ModalOrderDetail from "./components/Modal/ModalOrderDetail";
import AddOrder from "./components/AddOrder/AddOrder";
import TypeOrder from "../../../libraries/typeOrder";
const { RangePicker } = DatePicker;
export default function Sales() {
  const [data, setData] = useState([]);
  const [dataFilter, setDataFilter] = useState([])
  const [filter, setFilter] = useState(null)
  const [dateGet, setDateGet] = useState(null)
  const [dateValue, setDatevalue] = useState(null)
  const [selections, setSelections] = useState([]);
  const [showOrderDetail, setShowOrderDetail] = useState(false)
  const [showAddOrder, setShowAddOrder] = useState(false)
  const [detailOrder, setDetailOrder] = useState(null)
  const items = [
    {
      key: "status",
      label: "Trạng thái",
      children: [
        {
          key: "all",
          label: "Tất cả",
          onClick: () => {
            setFilter(prev => prev == 'all' ? '': 'all')
          }
        },
        {
          key: "waitting",
          label: "Chờ duyệt",
          onClick: () => {
            setFilter('ORDER')
          }
        },
        {
          key: "success",
          label: "Đã duyệt",
          onClick: () => {
            setFilter('AGREED')
          }
        },
        {
          key: "canceled",
          label: "Bị hủy",
          onClick: () => {
            setFilter('CANCELED')
          }
        },
        {
          key: "declined",
          label: "Từ chối",
          onClick: () => {
            setFilter('DISAGREED')
          }
        },
        {
          key: "delivering",
          label: "Đang giao",
          onClick: () => {
            setFilter('SHIPPING')
          }
        },
        {
          key: "completed",
          label: "Đã hoàn thành",
          onClick: () => {
            setFilter('COMPLETED')
          }
        },
        {
          key: "deleted",
          label: "Đã xóa",
          onClick: () => {
            setFilter('delete')
          }
        },
      ],
    }
  ];
  const itemsAction = [
    {
      label: "Thêm mới",
      key: 'add',
      icon: <PlusSquareOutlined />,
      onClick: () => {
        setShowAddOrder(true)
      }
    }, {
      key: 'LimitDate',
      label: <Space direction="vertical" size={12} style={{ width: '300px', display: 'flex', 'justifyContent': 'end', flexDirection: 'row' }}>
        <span>Ngày lọc:</span>
        <RangePicker
          format="DD-MM-YYYY"
          value={dateValue}
          onChange={(value) => {
            if (value) {
              setDatevalue(value)
              const [start, end] = value
              setDateGet({
                startDate: start['$d'].getTime(),
                endDate: end['$d'].getTime()
              })

            }
            else {
              setDateGet(null)
              setDatevalue(null)

            }
          }}
          onOk={() => { }}
        />
      </Space>
    }
  ];
  const itemsActionDelete = [];
  //cấu hình column
  const columns = [

    {
      title: "Mã phiếu",
      dataIndex: "code",
      fixed: 'left',
      width: 100,
      render: (_, val) => {
        return <a onClick={() => {
          setShowOrderDetail(true)
          setDetailOrder(val)
        }}>{val.code}</a>
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 100,
      fixed: 'left',
      render: (val) => {
        let typeOr = TypeOrder(val)
        return <Tag color={typeOr.color}>
          {typeOr.title}
        </Tag>
      }
    },
    {
      title: "Người đặt",
      dataIndex: "contactInformation",
      width: 150,
      render: (val) => {
        return val.fullname
      }
    },
    {
      title: "Ngày đặt",
      dataIndex: "createDate",
      width: 150,
    },
    {
      title: "Tổng tiền",
      dataIndex: "orderDetails",
      width: 150,
      render: (val) => {
        let totalMoney = 0
        val.forEach(vl => {
          totalMoney += (vl.price + vl.option.plus - vl.discount) * vl.option.quanity
        })
        return formatMoney(totalMoney)
      }
    },
    {
      title: "Diễn giải",
      dataIndex: "description",
      width: 150,
    },
  ]
  const ColumnsOrderDeletedAction = [];
  const ColumnsOrderAction = [];
  //xử lý checkbox
  const rowSelection = {
    selections,
    onChange: (newSelectedRowKeys, selections) => {
      setSelections(selections);
    },
  };

  useEffect(() => {
    async function getDataOrder(dateGet) {
      let param = {}
      if (dateGet) {
        param = dateGet
      }
      const dataOrder = await axiosClient.get('/admin/data/orders', {
        params: param
      })
      const dataWKey = dataOrder.data.map(val => ({
        ...val,
        key: val._id
      }))
      setData(dataWKey)
      if (data.length == 0) {
        setDataFilter(dataWKey)
      }
      else {
        setDataFilter(data)
      }
    }
    getDataOrder(dateGet)

  }, [dateGet])
  useEffect(() => {
    function setDtFilter(filter) {
      if (filter === 'all' || filter === '') {
        setDataFilter(data)
      } else {
        if(filter == 'delete') {
          setDataFilter(data.filter(vl => vl.deleted))
        }
        else {
          setDataFilter(data.filter(vl => vl.status == filter))
        }
      }
    }
    setDtFilter(filter)
    if (!filter) {
      setFilter('all')
    }
  }, [filter,dateGet])
  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <ContentHandle
          itemsFilter={items}
          itemsAction={filter === "delete" ? itemsActionDelete : itemsAction}
          dataTable={dataFilter}
          rowSelection={rowSelection}
          columns={filter === "delete" ? [...columns, ...ColumnsOrderDeletedAction] : [...columns, ...ColumnsOrderAction]}
          pagination={{ pageSize: 6 }}
          tableScroll={true}
        />
      </div>
      {detailOrder && <ModalOrderDetail isModalOpen={showOrderDetail} handleCancel={() => setShowOrderDetail(false)} data={detailOrder} />}
      <AddOrder isOpen={showAddOrder} handleCancel={() => setShowAddOrder(false)} />
    </>
  );
}
