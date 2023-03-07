import { Image } from 'antd'
import React from 'react'
import {images} from '../../assets/images'
import {Link} from 'react-router-dom'

export default function Error() {
  return (
    <div>
      <Link to={'/'}>Quay về trang chủ</Link>
        <Image src={images.errorPage} style={{width: "100vw",height:"100vh","objectFit": "contain"}}/>
    </div>
  )
}
