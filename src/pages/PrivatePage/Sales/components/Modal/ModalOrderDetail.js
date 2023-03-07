import React, { useEffect, useState } from 'react'
import { Modal, Form, Layout, Button, Input, Row, Col, Table, message, Radio,Select } from 'antd'
import { LikeOutlined, DislikeOutlined, FunnelPlotOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ModalListProducts from './ModalListProducts';
import formatMoney from '../../../../../libraries/formatMoney';
import axiosClient from '../../../../../libraries/axiosClient';

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
};
const contentStyle = {
    textAlign: 'center',
    minHeight: 120,
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#fff',
    padding: "20px 0"
};
const siderStyle = {
    textAlign: 'center',
    lineHeight: '120px',
    color: '#fff',
    backgroundColor: '#3ba0e9',
};
const footerStyle = {
    textAlign: 'left',
    color: '#fff',
    backgroundColor: '#7dbcea',
};


export default function ModalOrderDetail({ isModalOpen, handleCancel, handleOk, data }) {
    const navigate = useNavigate()
    const [showProducts, setShowProducts] = useState(false)
    const [form] = Form.useForm()
    const [enableChange, setEnableChange] = useState(false)
    const [productsSelect, setProductsSelect] = useState([])

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
                return formatMoney((val.price + val.option.plus) * val.option.quanity)
            }
        },

        {
            title: "Xóa",
            dataIndex: 'code',
            render: (_, val) => {
                return <Button disabled={!enableChange} onClick={() => {
                    setProductsSelect(prev => prev.filter(vl => !(vl.productCode == val.productCode && vl.option.color == val.option.color)))
                }} type="primary" danger> Xóa</Button>
            }
        },
    ]
    useEffect(() => {
        form.setFieldsValue({ ...data })
        setProductsSelect(data.orderDetails.map(pr => ({
            ...pr,
            key: pr.id
        })))
    }, [])
    async function handleStatus(status) {
        const rsSt = await axiosClient.patch(`/admin/data/orders/UPDATE/update/${data._id}`, {
            status
        })
        if (rsSt.status) {
            message.success('Cập nhật thành công')
            navigate(0)
        }
    }

    async function handleDelete() {
        const rsDl = await axiosClient.delete(`/admin/data/orders/UPDATE/delete/${data._id}`)
        if (rsDl.status) {
            message.success('Cập nhật thành công')
            navigate(0)
        }
    }

    async function handleRestore() {
        const rsRs = await axiosClient.patch(`/admin/data/orders/UPDATE/restore/${data._id}`)
        if (rsRs.status) {
            message.success('Cập nhật thành công')
            navigate(0)
        }
    }

    async function handleUpdateOrder(value) {
        value.orderDetails = productsSelect
        let id = value._id
        delete value._id
        try {
            const rsUpdate = await axiosClient.patch(`/admin/data/orders/UPDATE/update/${id}`, value)
            if (rsUpdate.status) {
                message.success(rsUpdate.message)
                navigate(0)
            }
        } catch (error) {
            console.log("Lỗi update: ", error);
            message.error('Lỗi cập nhật đơn hàng')
        }
    }
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
    return (
        <>
            <Modal title="Thông tin đơn hàng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} width={'100vw'} footer={null} closable={false}>
                <Layout>
                    <Header style={headerStyle}>
                        {!data.deleted && <div >
                            <Button onClick={() => {
                                handleStatus('AGREED')
                            }}>Duyệt <LikeOutlined /></Button>
                            <Button onClick={() => {
                                handleStatus('DISAGREED')
                            }}>Từ chối <DislikeOutlined /></Button>
                        </div>}

                        <div>
                            {enableChange ? <Button onClick={() => {
                                form.submit()
                                handleCancel()
                            }}>Lưu và đóng</Button> : <Button onClick={() => setEnableChange(true)}>Sửa</Button>}
                            <Button onClick={() => {
                                handleCancel()
                                setEnableChange(false)
                            }}>Đóng</Button>
                            {data.deleted ? <Button onClick={() => {
                                handleRestore()
                            }}>Khôi phục</Button> : <Button onClick={() => {
                                handleDelete()
                            }}>Xóa</Button>}
                        </div>
                    </Header>
                    <Content style={contentStyle}>
                        <Form form={form} onFinish={handleUpdateOrder} disabled={!enableChange}>
                            <Form.Item name='_id' hidden>
                                <Input />
                            </Form.Item>
                            <Row gutter={18}>
                                <Col span={6}>
                                    <Form.Item label='Mã phiếu' name='code'>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label='Trạng thái' name={['status']} rules={[{ required: true, message: "Phải có trạng thái đơn hàng !!" }]}>
                                        <Select options={optionsStatus} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label='Ngày đặt' name='createDate' >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col>
                                    <Form.Item label='Khách hàng' name={['contactInformation', 'fullname']} >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col>
                                    <Form.Item label='Địa chỉ' name={['shippingInformation', 'address']}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item label='sdt' name={['contactInformation', 'phone']}>
                                <Input />
                            </Form.Item>
                            <Form.Item label='Thông tin thanh toán'>
                                <Form.Item label='Hình thức thanh toán' name={['paymentInformation', 'type']}>
                                    <Radio.Group options={[{
                                        label: "Thanh toán khi nhận hàng",
                                        value: "CASH"
                                    }, {
                                        label: "Chuyển khoản",
                                        value: "CREDIT CARD"
                                    }]} />
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
                            <Form.Item label='chú thích' name={['description']}>
                                <Input />
                            </Form.Item>
                        </Form>
                        <Row><Col>Sản phẩm đặt </Col> </Row>
                        <Row><Col><Button disabled={!enableChange} onClick={() => setShowProducts(true)}>Danh sách sản phẩm <FunnelPlotOutlined /></Button></Col></Row>
                        <Table
                            bordered
                            columns={columns}
                            dataSource={productsSelect.map(vl => ({
                                ...vl,
                                key: vl._id
                            }))}
                        />
                    </Content>
                    <Footer style={footerStyle}>Tổng tiền hàng : {formatMoney(productsSelect.reduce(
                        (prev, next) => {
                            return prev + (next.price + next.option.plus - next.price * next.discount / 100) * next.option.quanity
                        }, 0
                    ))}</Footer>
                </Layout>
            </Modal>
            <ModalListProducts isOpen={showProducts} handleCancel={() => {
                setShowProducts(false)
            }} handleOk={setProductsSelect} data={productsSelect} />

        </>
    )
}
