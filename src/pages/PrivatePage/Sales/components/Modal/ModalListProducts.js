import React, { useEffect, useState } from 'react'
import { Button, Modal, Select, Table } from 'antd'
import axiosClient from '../../../../../libraries/axiosClient'
import formatMoney from '../../../../../libraries/formatMoney'

export default function ModalListProducts({ isOpen, handleCancel, handleAddProduct, handleOk, data, choiceProduct = [] }) {
  const [products, setProducts] = useState([])
  const [selections, setSelections] = useState([]);
  const [selectProduct, setSelectProduct] = useState([])
  const [listOption, setListOption] = useState({})

  const columns = [
    {
      title: "Mã sản phẩm",
      dataIndex: "code"
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name"
    },
    {
      title: "Đơn giá",
      dataIndex: 'price',
      render: (val) => {
        return formatMoney(val)
      }
    },
    {
      title: "Các tùy chọn",
      render: (_, val) => {
        return <Select onChange={(value) => {
          setListOption(prev => ({
            ...prev, [val._id]: {
              color: value,
            }
          }))
        }} style={{
          width: 200,
        }} options={val.options.map(vl => ({
          value: vl.color,
          label: vl.color,
        }))}
          defaultValue={{
            value: val.options[0].color,
            label: val.options[0].color,
          }}
        />
      }
    },
    {
      title: "Tồn kho",
      dataIndex: "stock"
    },
    {
      title: "Thêm",
      render: (_, value) => {
        return <Button onClick={() => setSelectProduct(prev => {
          let productDetail = {
            "productCode": value.code,
            "price": value.price,
            "discount": value.discount,
            option: listOption[value._id] ? {
              "color": listOption[value._id].color,
              "quanity": 1,
              "plus": Number.parseInt(value.options.find(op => op.color == listOption[value._id].color).plus)
            } : {
              "color": value.options[0].color,
              "quanity": 1,
              "plus": Number.parseInt(value.options[0].plus)
            },
            product: value
          }

          let oldProductSelect = prev.find(pr =>
            (pr.productCode == productDetail.productCode && pr.option.color == productDetail.option.color)
          )
          if (!!oldProductSelect) {
            prev.forEach(sp => {
              if (sp.productCode == productDetail.productCode && sp.option.color == productDetail.option.color) {
                sp.option.quanity += 1
              }
            })
            return [...prev]
          }
          else {
            return [...prev, productDetail]
          }
        })}>Thêm</Button>
      }
    }
  ]
  const columnsSelect = [
    {
      title: '#',
    },
    {
      title: 'Mã sản phẩm',
      dataIndex: 'product',
      render: (vl) => {
        return vl.code
      }
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      render: (vl) => vl.name
    },
    {
      title: "Đơn giá",
      dataIndex: 'price',
      render: (val) => formatMoney(val)
    },
    {
      title: "Số lượng",
      dataIndex: "option",
      render: (val) => {
        return val.quanity
      }
    },
    {
      title: "Tùy chọn",
      dataIndex: 'option',
      render: (val) => {
        return val.color
      }
    },
    {
      title: "Thành tiền",
      render: (_, val) => {
        return formatMoney((Number.parseInt(val.price) + Number.parseInt(val.option.plus)) * (1 - val.discount / 100) * val.option.quanity)
      }
    },

    {
      title: "Xóa",
      render: (_, value) => {
        return <Button onClick={() => setSelectProduct(prev => prev.filter(pr => !(pr.productCode == value.productCode && pr.option.color == value.option.color)))}>Xóa</Button>
      }
    }
  ]

  useEffect(() => {
    async function getProducts() {
      const listProducts = await axiosClient.get('/admin/data/products?active=true')
      const productsWithKey = listProducts.data.map(value => {
        return ({
          ...value,
          key: value.slug
        })
      })
      setProducts(productsWithKey)
    }
    getProducts()
  }, [])
  return (
    <Modal open={isOpen} onOk={() => {
      data.forEach(sp => {
        let spSame = []
        selectProduct.forEach((slPd ,index)=> {
          if (sp.productCode === slPd.productCode && sp.option.color === slPd.option.color) {
            sp.option.quanity += slPd.option.quanity
            selectProduct.splice(index,1)
          }
        })
        if (Object.keys(spSame).length > 0) {
          sp.option.quanity += spSame.option.quanity
        }
      })
      console.log('data vào',[...data,...selectProduct]);
      handleOk([...data,...selectProduct])
      setSelectProduct([])
      handleCancel()
    }} onCancel={handleCancel} width={'100vw'} okText='Xác nhận' cancelText='Đóng'>
      <h1>Danh sách sản phẩm</h1>
      <Table columns={columns} dataSource={products} />
      <h1>Sản phẩm đã thêm</h1>
      <Table columns={columnsSelect} dataSource={selectProduct} />
    </Modal>
  )
}
