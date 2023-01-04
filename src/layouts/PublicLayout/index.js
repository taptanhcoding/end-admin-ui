import {Outlet} from 'react-router-dom'
import classnames from 'classnames/bind'
import styles from './PublicLayout.module.scss'

const cx = classnames.bind(styles)
function PublicLayout() {
    return ( <div className={cx('wrapper')}>
    <Outlet/>
    </div> );
}

export default PublicLayout;