import React, { useState, useEffect } from 'react'
import TokenDescription from './TokenDescription'
import useLocale from 'utils/hooks/useLocale'
import swal from 'sweetalert';
import { Dropdown } from 'components/ui'
import DropdownItem from 'components/ui/Dropdown/DropdownItem';
import { useSelector } from 'react-redux'
import contractABI from './abi/contractABI.json'
import { ethers } from 'ethers'

const defaultRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const contractAddress = "0xa06058A579165F14e3027643Cf2C7040b5Aaf340";


const ControlPanel = () => {
    let language = useLocale();
    const account = useSelector(state => state.theme.defaultAccount);

    const moduleTypes =
        [
            {
                MODULE: language !== "CN" ? "Normal Token" : "普通代幣",
            },
            {
                MODULE: language !== "CN" ? "Marketing && LP Token" : "營銷回流代幣",
            },
            {
                MODULE: language !== "CN" ? "Reward Token" : "分紅代幣",
            },
        ]

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimal, setDecimal] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [routerAddress, setRouterAddress] = useState(defaultRouter);

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)

    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(moduleTypes[0].MODULE);

    const updateEthers = async () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner)
        setContract(tempContract);

        let contractsMade = await tempContract.addressDeployedContract(account,0);
        console.log(contractsMade);
    }

    useEffect(() => {
        if (account !== null)
            updateEthers()
    }, [account])

    const styles = {
        height: '80px',
        width: '100%',
        paddingRight: '5vw',
        paddingLeft: '5vw',
    }

    const styles2 = {
        border: '1px solid black',
        width: '90%',
        height: '30px',
        padding: '5px 10px',
        marginTop: '5px',
        borderRadius: '5px',
    }

    const ErrorChinese = (text, value) => {
        if (value === '') value = "空"
        swal("錯誤", `${text} 的值 不可為 ${value}`, "error")
    }
    const ErrorEnglish = (text, value) => {
        if (value === '') value = "null"
        swal("錯誤", `The value of ${text} : ${value} is invalid`, "error")
    }

    const submitValue = (e) => {
        e.preventDefault();
        if (name === '') {
            if (language !== "CN") {
                ErrorEnglish("Token Name", name)
                return;
            }
            ErrorChinese("代幣名稱", name)
            return;
        }
        if (symbol === '') {
            if (language !== "CN") {
                ErrorEnglish("Token Symbol", symbol)
                return;
            }
            ErrorChinese("代幣縮寫", symbol)
            return;
        }
        if (decimal === '' || decimal < 0 || decimal > 18) {
            if (language !== "CN") {
                ErrorEnglish("Token Decimal", decimal)
                return;
            }
            ErrorChinese("代幣精度", decimal)
            return;
        }
        if (totalSupply === '' || totalSupply < 0 || totalSupply.toString().includes(".")) {
            if (language !== "CN") {
                ErrorEnglish("Token Supply", totalSupply)
                return;
            }
            ErrorChinese("代幣供應量", totalSupply)
            return;
        }

        console.log(`
        ==== Values ====
        Name : ${name}
        Symbol : ${symbol}
        Decimal : ${decimal}
        Total Supply : ${totalSupply}
        `)
    }

    const deploy = async () => {
        try {
            let result = await contract.deploy()
            let result2 = await provider.getTransaction(result.hash)
            console.log(result2)
        } catch (err) {
            console.log(err)
        }
    }

    const texts = {
        title: language !== "CN" ? "Control Panel" : "代幣控制台",
        module: language !== "CN" ? "Token Type" : "請選擇合約模板",
        description: language !== "CN" ? "Token Description" : "代幣說明",
    }

    const datas = [
        {
            title: language !== "CN" ? "Token Name" : "代幣名稱",
            value: name,
            textType: "text",
            function: e => setName(e.target.value),
            style: styles2,
            placeholder: "Ethereum",
        },
        {
            title: language !== "CN" ? "Token Symbol" : "代幣縮寫",
            value: symbol,
            textType: "text",
            function: e => setSymbol(e.target.value),
            style: styles2,
            placeholder: "Eth",
        },
        {
            title: language !== "CN" ? "Token Decimal" : "代幣精度",
            value: decimal,
            textType: "number",
            function: e => setDecimal(e.target.value),
            style: styles2,
            placeholder: "18",
        },
        {
            title: language !== "CN" ? "Token Supply" : "代幣供應量",
            value: totalSupply,
            textType: "number",
            function: e => setTotalSupply(e.target.value),
            style: styles2,
            placeholder: "1000000",
        },
        {
            title: language !== "CN" ? "Router Address" : "路由地址",
            value: routerAddress,
            textType: "text",
            function: e => setRouterAddress(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
    ]

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionSelect = (value) => {
        setSelectedValue(value);
        setIsOpen(false);
    };

    const dropDownStyle = {
        position: "absolute",
        top: "100%",
        left: "0",
        backgroundColor: "lightgray",
        boxShadow: "0px 8px 16px 0px rgba(0,0,0,0.2)",
        padding: "10px 0",
        width: "100%",
        borderRadius: "5px",
        zIndex: "1",
        display: "none",
    }
    return (
        <div style={{
            width: '100%',
            color: 'black',
            position: 'absolute',
            height: '85vh',
            overflowY: 'scroll',
            paddingLeft: '20px',
            border: '1px solid lightgray'
        }}>
            <div style={{ textAlign: 'left', paddingTop: '15px' }}>
                <h1>{texts.title}</h1><br />
            </div>
            <div>
                <h5 style={{
                    justifyContent: 'space-between',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '90%'
                }}>
                    <div>
                        {texts.module}
                    </div>
                    <div>
                        {texts.description}
                    </div>
                </h5>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <span
                        onClick={toggleDropdown}
                        style={{
                            marginLeft: '5vw',
                            backgroundColor: 'white',
                            border: '1px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            maxWidth: '250px',
                            width: '100%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            flexDirection: 'row',
                            fontWeight: 'bold',
                            alignItems: 'center',
                        }}>
                        <div>{selectedValue || texts.module}</div><div> ▼ </div>
                    </span>
                </div>
            </div>
            {
                isOpen && (
                    <ul style={{ marginLeft: '5vw', zIndex: '1', position: 'absolute', backgroundColor: 'white', border: '1px solid black' }}>
                        {
                            moduleTypes.map((module, index) => {
                                return (
                                    <li
                                        onClick={() => handleOptionSelect(`${module.MODULE}`)}
                                        key={index}
                                        style={{
                                            padding: '5px 10px',
                                            width: '250px',
                                        }}
                                    >{module.MODULE}</li>
                                )
                            })
                        }
                    </ul>
                )
            }
            <br />

            <div
                className="createContractWrapper"
                style={{
                    marginRight: '10vw',
                }}>

                {
                    datas.map((data, index) => {
                        return (
                            <div key={index} style={styles}>
                                <h4>{data.title}</h4>
                                <input
                                    text={data.textType}
                                    value={data.value}
                                    onChange={data.function}
                                    style={data.style}
                                    placeholder={data.placeholder}
                                />
                            </div>
                        )
                    })
                }
            </div>

            <button onClick={submitValue}
                style={styles2 && { width: '80%' }}
            >Submit Value</button>

            <button onClick={deploy}
                style={styles2 && { width: '80%' }}
            >Deploy</button>
        </div>
    )
}

export default ControlPanel
