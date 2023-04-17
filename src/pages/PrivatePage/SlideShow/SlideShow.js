import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image, message, Form, List } from "antd";
import { LockOutlined, PlusOutlined, DeleteOutlined, UnlockOutlined } from "@ant-design/icons";
import axiosClient from "../../../libraries/axiosClient";
import ContentHandle from "../../../components/ContentHandle/ContentHandle";
import {
  HandleSlideShow,
  showHandleStatusConfirm,
} from "../../../libraries/Modal";
import { images } from "../../../assets/images";
import TimeTrans from "../../../libraries/timeTrans";

function SliderShow() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState([]);
  const [showAdd, setShowAdd] = useState(false)
  //xử lý dữ liệu vào
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState('all')
  const [dataFilter, setDataFilter] = useState([])
  const [dataUpdate, setDataUpdate] = useState(null)
  const [showUpdate, setShowUpdate] = useState(false)

  //xử lý upload file

  //xử lý layout,modal,form
  const [form] = Form.useForm();

  // Đây là Dữ liệu truyền vào
  //menu
  const items = [
    {
      key: "status",
      label: "Trạng thái",
      children: [
        {
          key: "all",
          label: "Tất cả",
          onClick: () => {
            setFilter(prev => prev == 'all' ? "" : 'all');
          },
        },
        {
          key: "active",
          label: "Hoạt động",
          onClick: () => {
            setFilter("active");
          },
        },
        {
          key: "lock",
          label: "Khóa",
          onClick: () => {
            setFilter('lock');
          },
        },
        {
          key: "delete",
          label: "Đã xóa",
          onClick: () => {
            setFilter("delete");
          },
        },
      ],
    },
  ];
  //action trong table
  const itemsAction = [
    {
      key: "add",
      label: "Thêm mới",
      icon: <PlusOutlined />,
      onClick: () => {
        setShowAdd(true)
      },
    },
    {
      key: "control",
      label: "Quản trị",
      icon: <LockOutlined />,
      children: [
        {
          key: "Delete",
          label: "Xóa nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Slider",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/sliders/UPDATE/deletes",
                    { data: { ids } }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
        {
          key: "actives",
          label: "Kích hoạt",
          icon: <UnlockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Unlock",
              type: "Slider",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/sliders/UPDATE/changeStatusM",
                    { ids, status: true }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
        {
          key: "locks",
          label: "Khóa",
          icon: <LockOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Lock",
              type: "Slider",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                console.log(ids);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/sliders/UPDATE/changeStatusM",
                    { ids, status: false }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
      ],
    },
  ];

  const itemsActionDelete = [
    {
      key: "control",
      label: "Quản trị",
      icon: <LockOutlined />,
      children: [
        {
          key: "Restore",
          label: "Kích hoạt",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Restore",
              type: "Sliders",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                let formData = new FormData();
                formData.append("ids", IDBObjectStore);
                try {
                  const deletesCtSt = await axiosClient.patch(
                    "/admin/data/sliders/UPDATE/restores",
                    { ids }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
        {
          key: "destroys",
          label: "Hủy diệt nhiều",
          icon: <DeleteOutlined />,
          onClick: async () => {
            showHandleStatusConfirm({
              action: "Delete",
              type: "Slider",
              value: selections,
              cb: async (value) => {
                const ids = value.map((v) => v._id);
                try {
                  const deletesCtSt = await axiosClient.delete(
                    "/admin/data/sliders/DELETE/destroys",
                    {
                      data: {ids}
                    }
                  );
                  message.info(deletesCtSt.message);
                  navigate(0);
                } catch (error) {
                  console.log(error);
                  message.error(error?.response?.data?.message);
                }
              },
            });
          },
        },
      ],
    },
  ];
  //column table

  const customerColumnShare = [
    {
      title: "Trạng thái",
      dataIndex: "active",
      render: (data) => {
        return !data ? <LockOutlined /> : <UnlockOutlined />
      },
      width: '90px',
      align: 'center',
      fixed: 'left'
    },
    {
      title: "Mô tả ngắn",
      dataIndex: "title",
      fixed: 'left',
      width: '150px'
    },
    {
      title: "Link tới",
      dataIndex: "to",
      render: (val) => {
        return `${val.type}/${val.link}`
      }
    },
    {
      title: "Kiểu Slide",
      dataIndex: 'typeSlide'
    },
    {
      title: "Vị trí hiển thị",
      dataIndex: 'promotionPosition',
      render: (value) => {

      }
    },
    {
      title: "hình ảnh",
      dataIndex: "coverImgUrl",
      render: (text) => {
        return (
          <Image
            width={150}
            height={50}
            src={`${process.env.REACT_APP_API_URL}/${text}`}
            fallback={images.error}
          />
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (data) => {
        return TimeTrans(data);
      },
    },
  ]
  const ColumnsSliders = [
    ...customerColumnShare,
    {
      title: "Action",
      fixed: 'right',
      render: (_, value) => {
        return (
          <>
            <Button
              type="primary"
              ghost
              style={{ marginRight: "10px" }}
              onClick={() => {
                setDataUpdate(value)
                setShowUpdate(true)
              }}
            >
              Sửa
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Delete",
                  type: "Slider",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let deleteStatus = await axiosClient.delete(
                        `/admin/data/sliders/UPDATE/delete/${value[0]._id}`
                      );
                      console.log("deleteStatus", deleteStatus);
                      message.info(deleteStatus.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Xóa
            </Button>
          </>
        );
      },
    },
  ];

  const ColumnsSlidersDeleted = [
    ...customerColumnShare,
    {
      title: "Action",
      fixed: 'right',
      render: (_, value) => {
        return (
          <>
            <Button
              type="primary"
              ghost
              style={{ marginRight: "10px" }}
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Restore",
                  type: "Slider",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let restoreSt = await axiosClient.patch(
                        `/admin/data/sliders/UPDATE/restore/${value[0]._id}`
                      );
                      message.info(restoreSt.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Khôi phục
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => {
                showHandleStatusConfirm({
                  action: "Destroy",
                  type: "Slider",
                  value: [value],
                  cb: async (value) => {
                    try {
                      let destroySt = await axiosClient.delete(
                        `/admin/data/sliders/DELETE/destroy/${value[0]._id}`
                      );
                      message.info(destroySt.message);
                      navigate(0);
                    } catch (error) {
                      console.log(error);
                      message.error(error?.response?.data?.message);
                    }
                  },
                });
              }}
            >
              Hủy diệt
            </Button>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    async function getDataSliders() {
      const sliders = await axiosClient.get("/admin/data/sliders");
      const dataWithKey = sliders.data.map((value) => ({
        ...value,
        key: value._id,
      }));
      setData(dataWithKey);
    }
    getDataSliders();
  }, []);
  useEffect(() => {
    switch (filter) {
      case 'all':
        setDataFilter(data)
        break;
      case 'active':
        setDataFilter(data.filter(vl => vl.active && !vl.deleted))
        break;
      case 'lock':
        setDataFilter(data.filter(vl => !vl.active && !vl.deleted))
        break
      case 'delete':
        setDataFilter(data.filter(vl => vl.deleted))
        break
      default:
        break;
    }
    if (filter === '') {
      setFilter('all')
    }

  }, [filter, data])

  //xử lý checkbox
  const rowSelection = {
    selections,
    onChange: (newSelectedRowKeys, selections) => {
      setSelections(selections);
    },
  };
  async function handleAddSlide(val) {
    try {
      let file = val.fileImage
      let formData = new FormData();
      if (val.fileImage) {
      }
      formData.append('file', file.file)
      delete val.fileImage
      const rsSlide = await axiosClient.post(`/admin/data/sliders/ADD/add`, val)
      if (rsSlide?.status) {
        message.success('Úp data thành công')
        const rsUpImg = await axiosClient.post(`/admin/upload-single/sliders/${rsSlide.data._id}`, formData)
        message.success('Úp ảnh thành công')
        navigate(0)
      } else return false
    } catch (error) {
      console.log("Lỗi khi thêm slider ", error);
      message.error("Lỗi")
    }
  }
  async function handleUpdateSlide(val) {
    try {
      let file= val.fileImage
      let formData = new FormData();
      if(file) {
        formData.append('file',file.file)
      }
      delete val.fileImage
      const rsSlide = await axiosClient.patch(`/admin/data/sliders/UPDATE/update/${val._id}`,val)
      if(rsSlide?.status) {
        message.success('Úp data thành công')
        const rsUpImg = await axiosClient.post(`/admin/upload-single/sliders/${rsSlide.data._id}`,formData)
        message.success('Úp ảnh thành công')
        navigate(0)                
      }else return false
    } catch (error) {
      console.log("Lỗi khi thêm slider ", error);
      message.error("Lỗi")
    }
  }
  //endx
  return (
    <>
      <div style={{ paddingTop: "10px" }}>
        <ContentHandle
          tableScroll={true}
          itemsFilter={items}
          itemsAction={filter === "delete" ? itemsActionDelete : itemsAction}
          dataTable={dataFilter}
          rowSelection={rowSelection}
          columns={
            filter === "delete" ? ColumnsSlidersDeleted : ColumnsSliders
          }
          pagination={{ pageSize: 6 }}
        />
      </div>
      
      {dataUpdate ? <HandleSlideShow handle={'update'} value={dataUpdate} open={showUpdate} close={() => setShowUpdate(false)} 
      /> :
      <HandleSlideShow handle={'add'} open={showAdd} close={() => setShowAdd(false)} 
      />}
    </>
  );
}

export default SliderShow;
