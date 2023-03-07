import { Tag } from "antd";


export default function TypeOrder(type) {
    switch (type) {
        case "ORDER":
            return {
                title: "Đã đặt hàng",
                'color': ""
            }
            break;
        case "AGREED":
            return {
                title: "Đã duyệt",
                'color': ""
            }
            break;
        case "SHIPPING":
            return {
                title: "Đang giao hàng",
                'color': ""
            }
            break;
        case "COMPLETED":
            return {
                title: "Đã hoàn thành",
                'color': ""
            }
            break;
        case "CANCELED":
            return {
                title: "Bị hủy",
                'color': ""
            }
            break;
        case "DISAGREED":
            return {
                title: "Bị từ chối",
                'color': ""
            }
            break;
        default:
            break;
    }
}