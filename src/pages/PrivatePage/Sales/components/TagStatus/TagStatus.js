import { Tag } from "antd";

import React from 'react'

export default function TagStatus({ Icon, title }) {
    return (
        <Tag icon={<Icon />} color="processing">
            {title}
        </Tag>
    )
}
