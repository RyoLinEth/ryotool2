import React from 'react'
import './body.css'
import Bottom from './Bottom'
import { Link } from 'react-router-dom'

const Body = () => {
    const cellContent = [
        {
            title: "批量平台幣轉帳",
            subtitle: `(一對多轉帳)`,
            link: '/transferether'
        },
        {
            title: "批量檢查平台幣餘額",
            subtitle: `(多錢包餘額)`,
            link: '/etherbalance'
        },
        {
            title: "批量平台幣歸集",
            subtitle: `(多對一轉帳)`,
            link: '/transferetherback'
        },
        {
            title: "批量生成錢包",
            subtitle: `(一鍵多錢包)`,
            link: '/generatewallet'
        },
        {
            title: "Some Content",
            subtitle: `(一鍵多錢包)`,
            link: '/'
        },
        {
            title: "Some Content",
            subtitle: `(一鍵多錢包)`,
            link: '/'
        },
        {
            title: "批量空投工具",
            subtitle: `(一鍵多錢包)`,
            link: '/batchtransferpublic'
        },
        {
            title: "Some Content",
            subtitle: `(一鍵多錢包)`,
            link: '/'
        },
        {
            title: "Some Content",
            subtitle: `(一鍵多錢包)`,
            link: '/'
        },
    ]
    return (
        <div style={{
            width: '100vw',
            color: 'black',
            position: 'absolute',
            top: '15vh',
            height: '85vh',
            overflowY: 'scroll'
        }}>
            <p style={{ fontSize: '40px', fontWeight: 'bolder' }}>
                小Ryo 測試版工具
            </p>
            <p style={{ fontSize: '15px', color: 'gray' }}>
                本工具不上傳任何私鑰信息<br />
                安全起見，建議在私鑰使用過，刪除私鑰<br />
            </p>

            <div className='toolWrapper'>
                <div className='toolrow'>
                    {cellContent.map((value, index) => (
                        <div key={index} className='toolCell'>
                            <div className='toolCard'>
                                <div>
                                    <p className='toolCardTitle'>
                                        {value.title}<br />
                                        <span style={{ color: 'gray', fontSize: '15px' }}>
                                            {value.subtitle}
                                        </span>
                                    </p>
                                    <Link to={value.link} style={{ textDecoration: "none", color: "white" }} >
                                        <button>Enter</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Bottom />
        </div>
    )
}

export default Body
