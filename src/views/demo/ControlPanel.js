import React, { useState, useEffect } from 'react'
import TokenDescription from './TokenDescription'
import useLocale from 'utils/hooks/useLocale'
import swal from 'sweetalert';
import { Dropdown } from 'components/ui'
import DropdownItem from 'components/ui/Dropdown/DropdownItem';
import { useSelector } from 'react-redux'
// import contractABI from './abi/contractABI.js'
import { ethers } from 'ethers'
import { text } from 'd3-fetch';

const defaultRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const contractAddress = "0xa06058A579165F14e3027643Cf2C7040b5Aaf340";


const ControlPanel = () => {
    let language = useLocale();
    const account = useSelector(state => state.theme.defaultAccount);

    const texts = {
        title: language === "CN" ? "控制台" : "Control Panel",
        giveUpAlert: language === "CN" ? "注意：當所有權放棄後，無法再使用任何開關" : "Note: After you renounce the ownership, you'll never ever be able to control the contract"
    }

    const controlBoxStyle1 = {
        display: 'flex',
        height: '40px',
        width: '45%',
        border: '1px solid black',
        borderRadius: '20px',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15px',
    }
    const controlBoxStyle2 = {
        display: 'flex',
        height: '40px',
        width: '80%',
        border: '0.5px solid gray',
        borderRadius: '5px',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15px',
        textAlign: 'center',
        marginBottom: '15px',
    }

    const controlWrapperStyle = {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100px',
        width: '45%',
        minWidth: '300px',
        // border: '1px solid black',
        marginTop: '30px',
        borderRadius: '10px'
    }

    const titleStyle = {
        color: 'red',
        display: 'flex',
        textAlign: 'left',
        paddingLeft: '10px',
        top: '10px',
        left: '20px',
        fontSize: '30px',
        fontWeight: 'bold',
    }
    const controls = [
        {
            title: language === "CN" ? "交易控制" : "Transaction",
            titleStyle: titleStyle,
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "開盤" : "Start Trading",
                        style: controlBoxStyle2,
                    },
                ]
        },
        {
            title: language === "CN" ? "數量控制" : "Amount",
            titleStyle: titleStyle,
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "單筆限購" : "Set Max Tx Amount",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "錢包限購" : "Set Max Wallet Amount",
                        style: controlBoxStyle2,
                    },
                ]
        },
        {
            title: language === "CN" ? "稅率" : "Taxes",
            titleStyle: titleStyle,
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "設置購買營銷稅率" : "Set Buy Marketing Fee",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置購買回流稅率" : "Set Buy Liquidity Fee",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置賣出營銷稅率" : "Set Sell Marketing Fee",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置賣出回流稅率" : "Set Sell Liquidity Fee",
                        style: controlBoxStyle2,
                    },
                ]
        },
        {
            title: language === "CN" ? "錢包地址" : "Wallets",
            titleStyle: titleStyle,
            // alert: language === "CN" ? "請注意：當所有權放棄後，無法再使用任何開關" : "Note: After you renounce the ownership, you'll never ever be able to control the contract",
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "設置免稅白名單" : "Set Whitelist",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置黑名單" : "Set Blacklist",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置營銷錢包" : "Set Marketing Wallet",
                        style: controlBoxStyle2,
                    },
                ]
        },
        {
            title: language === "CN" ? "分紅控制" : "Reflection",
            titleStyle: titleStyle,
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "設置分紅閥值" : "Set Reflection Threshold",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "設置分紅稅率" : "Set Reflection Threshold",
                        style: controlBoxStyle2,
                    },
                ]
        },
        {
            title: language === "CN" ? "所有權" : "Ownership",
            titleStyle: titleStyle,
            alert: language === "CN" ? "請注意：當所有權放棄後，無法再使用任何開關" : "Note: After you renounce the ownership, you'll never ever be able to control the contract",
            style: controlWrapperStyle,
            content:
                [
                    {
                        title: language === "CN" ? "放棄所有權" : "Renounce Ownership",
                        style: controlBoxStyle2,
                    },
                    {
                        title: language === "CN" ? "轉移所有權" : "Transfer Ownership",
                        style: controlBoxStyle2,
                    },
                ]
        },
    ]

    return (
        <div style={{
            width: '90%',
            color: 'black',
            position: 'absolute',
            height: '85vh',
            overflowY: 'scroll',
            paddingLeft: '20px',
            border: '1px solid lightgray'
        }}>
            <div style={{ textAlign: 'left', paddingTop: '15px' }}>
                <h1>{texts.title}</h1><br />
                <h5 style={{ color: 'gray' }}>{texts.giveUpAlert}</h5>
            </div>
            <div className='controlWrapper' style={{
                display: 'flex',
                flexDirection: 'column',
                height: '75vh',
                alignItems: 'center',
                // maxWidth: '600px',
                marginLeft: '-2vw',
            }}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    paddingTop: '10px',
                    width: '90%',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    {
                        controls.map((control, index) => {
                            return (
                                <div key={index} style={control.style}>
                                    <span style={control.titleStyle}>{control.title}</span>
                                    <span style={{ paddingLeft: '20px', }}>{control.alert}</span>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        {
                                            control.content !== undefined &&
                                            control.content.map((content, indexed) => {
                                                return (
                                                    <div key={indexed} style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                    }}>
                                                        <div style={content.style}>
                                                            <span>{content.title}</span>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default ControlPanel
