import {
  Avatar,
  Box,
  Flex,
  FormLabel,
  Icon,
  Select,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  MdAddTask,
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
  MdSupervisedUserCircle
} from "react-icons/md";
import MiniStatistics from '../../../components/MiniStatistics/MiniStatistics'
import IconBox from "../../../components/IconBox/IconBox";
import WeeklyRevenue from '../../../components/WeeklyRevenue/WeeklyRevenue'
import TotalSpent from "../../../components/TotalSpent/TotalSpent";
import { useEffect, useState } from "react";
import axiosClient from "../../../libraries/axiosClient";

function Home() {
  const [dashboard, setDashboard] = useState([])

  useEffect(() => {
    async function getDashboardData() {
      const rsDb = await axiosClient.get('/admin/dashboard')
      if (rsDb.status) {
        setDashboard(rsDb.data)
      }
    }

    getDashboardData()
  }, [])
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  return <div style={{ "height": "80vh" }}>
    <div style={{ display: 'flex', 'flexDirection': 'row', 'justifyContent': 'space-around' }}>
      {dashboard?.map((vl, index) => {
        let IconVL = <>icon</>
        switch (vl.title) {
          case 'Khách hàng':
            return <MiniStatistics name={vl.title} value={vl.total}
              startContent={
                <IconBox
                  w='56px'
                  h='56px'
                  bg={'#cccccc'}
                  icon={<Icon w='28px' h='28px' as={MdSupervisedUserCircle} color={'red'} />}
                />
              } />
            break;

          case 'Đơn giao thành công':
            return <MiniStatistics
              startContent={
                <IconBox
                  w='56px'
                  h='56px'
                  bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
                  icon={<Icon w='28px' h='28px' as={MdAddTask} color='white' />}
                />
              }
              name={vl.title} value={vl.total}
            />

            break;

          case 'Số lượng đang bán':
            return <MiniStatistics
              startContent={
                <IconBox
                  w='56px'
                  h='56px'
                  bg={'#cccccc'}
                  icon={
                    <Icon w='32px' h='32px' as={MdFileCopy} color={'red'} />
                  }
                />
              }
              name={vl.title} value={vl.total + 'sp'}
            />

            break;

          default:
            break;
        }
        return <MiniStatistics
          key={index}
          startContent={
            IconVL
          }
          name={vl.title}
          value={vl.total}
        />
      })}
    </div>


    <TotalSpent />
  </div>;
}

export default Home;
