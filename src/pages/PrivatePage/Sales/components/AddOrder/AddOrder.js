import { Modal, Form, Input, Button, Table, Select, Radio, message } from "antd";
import { FunnelPlotOutlined } from '@ant-design/icons'
import { useEffect, useState } from "react";
import axiosClient from "../../../../../libraries/axiosClient";
import ModalListProducts from "../Modal/ModalListProducts";
import formatMoney from "../../../../../libraries/formatMoney";
import { useNavigate } from "react-router-dom";
import useDelayInput from "../../../../../libraries/delayInput";

function AddOrder({ isOpen, handleOk, handleCancel }) {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [showProducts, setShowProducts] = useState(false)
    const [productsSelect, setProductsSelect] = useState([])
    const [optionsUser, setOptionsUser] = useState([])
    const [value,setValue] = useState(null)
    const columns = [
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
                return formatMoney((val.price + val.option.plus - val.price * val.discount / 100) * val.option.quanity)
            }
        },

        {
            title: "Xóa",
            dataIndex: 'code',
            render: (_, val) => {
                return <Button onClick={() => {
                    setProductsSelect(prev => prev.filter(vl => !(vl.productCode == val.productCode && vl.option.color == val.option.color)))
                }} type="primary" danger> Xóa</Button>
            }
        },
    ]
    const optionsStatus = [
        {
            label: "Đã đặt hàng",
            value: "ORDER"
        },
        {
            label: "Đã duyệt",
            value: "AGREED"
        },
        {
            label: "Bị từ chối",
            value: "DISAGREED"
        },
        {
            label: "Đang giao hàng",
            value: "SHIPPING"
        },
        {
            label: "Hoàn thành",
            value: "COMPLETED"
        },
        {
            label: "Bị hủy",
            value: "CANCELED"
        },
    ]
    async function handleAddOrder(value) {
        try {
            if (productsSelect.length == 0) {
                return false
            }
            value.orderDetails = productsSelect
            const rsAdd = await axiosClient.post('/admin/data/orders/ADD/add', value)
            if (rsAdd.status) {
                message.success('Thêm mới đơn đặt hàng thành công !')
                form.resetFields()
                setProductsSelect([])
                navigate(0)
            } else {
                message.error(rsAdd.message)
            }

        } catch (error) {
            console.log("Lỗi thêm mới đơn đặt hàng : ", error);
            message.error('Lỗi, Chưa thể thêm mới đơn hàng')
        }

    }
    useEffect(() => {
        async function SearchCt(keySearch) {
            const searchRs = await axiosClient.get(`/admin/data/customers`,{
                params:{
                    active: true
                },
            })
            setOptionsUser(searchRs.data)
        }
        SearchCt()
    },[])
    return (
        <>
            <Modal width={'100vw'} open={isOpen} onOk={() => {
                form.submit()
            }} onCancel={handleCancel} okText='Thêm mới' cancelText='Đóng'>
                <Form labelCol={{ span: 6 }} form={form} onFinish={handleAddOrder}>
                    <Form.Item label='Mã đơn hàng' name={['code']}>
                        <Input />
                    </Form.Item>
                    <Form.Item label='Trạng thái' name={['status']} rules={[{ required: true, message: "Phải có trạng thái đơn hàng !!" }]}>
                        <Select options={optionsStatus} />
                    </Form.Item>
                    <Form.Item label='Người dùng' name={['customerId']}>
                        <Select 
                            showSearch
                            value={value}
                            placeholder={"nhập mã khách hàng"}
                            defaultActiveFirstOption={false}
                            showArrow={false}
                            filterOption={false}
                            onChange={(vl) => setValue(vl)}
                            notFoundContent={null}
                            options={(optionsUser || []).map((d) => ({
                                value: d._id,
                                label: d.fullname,
                            }))}/>
                    </Form.Item>
                    <Form.Item label='Thông tin liên hệ' name={['contactInformation']} rules={[{ required: true, message: "Phải có thông tin liên hệ !!" }]}>
                        <Form.Item label='Tên' name={['contactInformation', 'fullname']}>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Số điện thoại' name={['contactInformation', 'phone']}>
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label='Thông tin giao hàng' rules={[{ required: true, message: "Phải có thông tin giao hàng !!" }]}>
                        <Form.Item label='Địa chỉ' name={['shippingInformation', 'address']}>
                            <Input />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label='Thông tin thanh toán'>
                        <Form.Item label='Hình thức thanh toán' name={['paymentInformation', 'type']}>
                            <Radio.Group options={[{
                                label: "Thanh toán khi nhận hàng",
                                value: "CASH"
                            }, {
                                label: "Chuyển khoản",
                                value: "CREDIT CARD"
                            }]}  />
                        </Form.Item>
                        <Form.Item label='Trạng thái' name={['paymentInformation', 'status']}>
                            <Radio.Group options={[{
                                label: "Đã thanh toán",
                                value: true
                            }, {
                                label: "Chưa thanh toán",
                                value: false
                            }]} />
                        </Form.Item>
                    </Form.Item>
                    <Form.Item label='Ghi chú' name={['description']}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Thông tin sản phẩm">
                        <Button onClick={() => setShowProducts(true)}>Danh sách sản phẩm <FunnelPlotOutlined /></Button>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={productsSelect.map(vl => ({
                                ...vl,
                                key: vl._id
                            }))}
                        />
                    </Form.Item>
                </Form>
                <div>
                    Tổng tiền hàng :
                    <p style={{ color: 'red' }}>
                        {formatMoney(productsSelect.reduce(
                            (prev, next) => {
                                return prev + (next.price + next.option.plus - next.price * next.discount / 100) * next.option.quanity
                            }, 0
                        ))}
                    </p>
                </div>
            </Modal>
            <ModalListProducts isOpen={showProducts} handleCancel={() => { setShowProducts(false) }} data={productsSelect} handleOk={setProductsSelect} />
        </>
    );
}

export default AddOrder;