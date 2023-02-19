import React, { useState, useEffect } from 'react'
import TokenDescription from './TokenDescription'
import useLocale from 'utils/hooks/useLocale'
import swal from 'sweetalert';
import { Dropdown } from 'components/ui'
import DropdownItem from 'components/ui/Dropdown/DropdownItem';
import { useSelector } from 'react-redux'
import contractABI from './abi/contractABI.json'
import tokenABI from './abi/tokenABI.json'
import { ethers } from 'ethers'
import { moduleTypesEN, moduleTypesCN } from './CreateData';
import { NormalToken, Market_LP_1 } from './bytecode/bytecodeAll';


const contractAddress = '0x06de5443c9C209C2288C930FD09F627c013aB9Ce'
const defaultRouter = '0xD99D1c33F9fC3444f8101754aBC46c52416550D1'

const Create = () => {
    let language = useLocale();
    const account = useSelector(state => state.theme.defaultAccount);
    const chainID = useSelector(state => state.theme.chainID);

    const initModuleType = [
        {
            MODULE: language === "CN" ? "請選擇合約模板" : "Choose Token Template",
            Description: ""
        }
    ]

    const ERRORSTATE = {
        STATE_1: language === "CN" ? "代幣地址異常" : "Token Not Found",
        STATE_2: language === "CN" ? "並非合約地址" : "Not A Contract"
    }

    const DROPDOWN = {
        DROPDOWN_MODULE: "0",
        DROPDOWN_BASE: "1",
        DROPDOWN_SWAP: "2",
    }

    const chainOptions = {
        okc: '0x42',
        bsc: '0x38',
        bsctest: '0x61'
    }

    const SwapOptions = {
        BSC: [
            {
                Name: "PancakeSwap",
                Contract: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
            },
            {
                Name: "BabySwap",
                Contract: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
            },
            {
                Name: "JSwap",
                Contract: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
            }
        ],
        BSCTest: [
            {
                Name: "PancakeSwap",
                Contract: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
            },
            {
                Name: "BabySwap",
                Contract: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
            },
        ],
        OKC: [
            {
                Name: "JSwap",
            }
        ]
    };

    const BaseOptions = {
        BSC: [
            //如果是BNB作為底池 直接使用一般合約
            {
                Name: "BNB",

            },
            //如果是其他代幣 則使用 以BEP20為底的合約
            {
                Name: "USDT",
                Contract: "0x55d398326f99059fF775485246999027B3197955"

            },
            {
                Name: "BUSD",
                Contract: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
            }
        ],
        BSCTest: [
            //如果是BNB作為底池 直接使用一般合約
            {
                Name: "BNB",

            },
            //如果是其他代幣 則使用 以BEP20為底的合約
            {
                Name: "USDT",
                Contract: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"

            },
            {
                Name: "BUSD",
                Contract: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814"
            }
        ],
        OKC: [
            {
                Name: "OKT",
            },
            {
                Name: "USDT",
                Contract: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"

            },
            {
                Name: "BUSD",
                Contract: "0xaB1a4d4f1D656d2450692D237fdD6C7f9146e814"
            }
        ]
    };

    /*
            ===================================
            ===================================
     
                USE STATE START    
     
            ===================================
            ===================================
    */
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimal, setDecimal] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [routerAddress, setRouterAddress] = useState(defaultRouter);
    const [marketingFee, setMarketingFee] = useState(0);
    const [liquidityFee, setLiquidityFee] = useState(0);
    const [rewardFee, setRewardFee] = useState(0);

    // const [rewardToken, setRewardToken] = useState(defaultReward[0].Contract);
    const [marketingWallet, setMarketingWallet] = useState('');
    const [lpBaseToken, setLpBaseToken] = useState('');

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [contract, setContract] = useState(null)
    const [nameSymbol, setNameSymbol] = useState("USDT");

    const [isOpen, setIsOpen] = useState(false);
    const [isBaseOpen, setIsBaseOpen] = useState(false);
    const [isSwapOpen, setIsSwapOpen] = useState(false);

    //選擇中文 還是英文模板
    const [moduleTypes, setModuleTypes] = useState(initModuleType)

    //選擇模板中的哪個模板 0稅 / 營銷回流 / 分紅
    const [selectedValue, setSelectedValue] = useState(moduleTypes[0].MODULE);

    //選擇模板代表的數字 0稅 - 1 / 營銷回流 - 2 / 分紅 - 3
    const [selectedValueIndex, setSelectedValueIndex] = useState(0);

    //偵測到在哪個鍊以後
    //傳入底池選項
    const [baseOptionsWithChain, setBaseOptionsWithChain] = useState([]);
    //傳入Swap選項
    const [swapOptionsWithChain, setSwapOptionsWithChain] = useState([]);

    const [selectedBaseValue, setSelectedBaseValue] = useState('');
    const [selectedBaseValueIndex, setSelectedBaseValueIndex] = useState(0);

    const [selectedSwapValue, setSelectedSwapValue] = useState('');
    const [selectedSwapValueIndex, setSelectedSwapValueIndex] = useState(0);

    const [isTokenNotFound, setIsTokenNotFound] = useState(false);

    /*
            ===================================
            ===================================
     
                USE STATE END    
     
            ===================================
            ===================================
    */

    const updateEthers = async () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, contractABI, tempSigner)
        setContract(tempContract);
    }

    const updateReward = async (value) => {
        try {
            let tempTokenContract = new ethers.Contract(value, tokenABI, signer)
            let tempSymbol = await tempTokenContract.symbol();
            setNameSymbol(`${tempSymbol}`)
        } catch {
            setNameSymbol(ERRORSTATE.STATE_2);
            setIsTokenNotFound(true);
        }
    }

    /*
            ===================================
            ===================================
     
                USE EFFECT START    
     
            ===================================
            ===================================
    */

    useEffect(() => {
        //偵測到 鍊 改變時，改變底池 以及 Router的選項

        if (chainID === chainOptions.bsc) {
            //更改Router選項
            setSwapOptionsWithChain(SwapOptions.BSC)
            setSelectedSwapValue(SwapOptions.BSC[0].Name)

            //更改底池選項
            setBaseOptionsWithChain(BaseOptions.BSC)
            setSelectedBaseValue(BaseOptions.BSC[0].Name)
        }
        if (chainID === chainOptions.bsctest) {
            setSwapOptionsWithChain(SwapOptions.BSCTest)
            setSelectedSwapValue(SwapOptions.BSCTest[0].Name)

            setBaseOptionsWithChain(BaseOptions.BSCTest)
            setSelectedBaseValue(BaseOptions.BSCTest[0].Name)
        }
        if (chainID === chainOptions.okc) {
            setSwapOptionsWithChain(SwapOptions.OKC)
            setSelectedSwapValue(SwapOptions.OKC[0].Name)

            setBaseOptionsWithChain(BaseOptions.OKC)
            setSelectedBaseValue(BaseOptions.OKC[0].Name)
        }
    }, [chainID])

    useEffect(() => {
        if (account !== null)
            updateEthers()
    }, [account, chainID])


    /*  更換語言時 模板更換 */
    useEffect(() => {
        if (language === "CN") {
            setModuleTypes(moduleTypesCN)
            setSelectedValue(moduleTypesCN[selectedValueIndex].MODULE);
            return;
        }
        setModuleTypes(moduleTypesEN)
        setSelectedValue(moduleTypesEN[selectedValueIndex].MODULE);
        return;
    }, [language])


    /*
            ===================================
            ===================================
     
                USE EFFECT END    
     
            ===================================
            ===================================
    */

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
    const styles3 = {
        border: '1px solid black',
        width: '90%',
        height: '30px',
        padding: '5px 10px',
        marginTop: '5px',
        borderRadius: '5px',
        justifyContent: 'space-between',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
    }

    const ErrorChinese = (text, value) => {
        if (value === '') value = "空"
        swal("錯誤", `${text}的值 不可為 ${value}`, "error")
    }
    const ErrorEnglish = (text, value) => {
        if (value === '') value = "null"
        swal("Error", `The value of ${text} : ${value} is invalid`, "error")
    }

    const deploy = async (value) => {
        if (value === 0) {
            /* 還沒有選定任何模板 */
        }
        /* 0稅普通模板*/
        if (value === 1)
            try {
                let etherValue = ethers.utils.parseEther("0.05");
                // console.log(etherValue);
                let result = await contract.deployNormalContract(
                    NormalToken,
                    [name, symbol],
                    totalSupply,
                    decimal,
                    { value: etherValue },
                )
                console.log(result)
            } catch (err) {
                console.log(err)
            }
        /* 營銷回流模板 */
        if (value === 2) {
            /* 選定BNB 模板 */
            if (selectedBaseValueIndex === 0) {
                console.log(routerAddress)
                try {
                    let result = await contract.deployContract(
                        value,
                        Market_LP_1,
                        [routerAddress, marketingWallet],
                        [name, symbol],
                        [marketingFee * 100, liquidityFee * 100],
                        [marketingFee * 100, liquidityFee * 100],
                        totalSupply,
                        decimal,
                    )
                    console.log(result)
                } catch (err) {
                    console.log(err)
                }
            }

            /* 選定其他底池模板 */
            /* USDT模板 */
            if (selectedBaseValueIndex !== 0) { console.log(lpBaseToken) }
            // try {
            //     let result = await contract.deploy(
            //         routerAddress,
            //         baseOptionsWithChain[selectedBaseValueIndex].contract,
            //         name,
            //         symbol,
            //         [marketingFee * 100, liquidityFee * 100],
            //         [marketingFee * 100, liquidityFee * 100],
            //         decimal,
            //         totalSupply,
            //         marketingWallet
            //     )
            //     console.log(result)
            // } catch (err) {
            //     console.log(err)
            // }
        }

    }

    const beforedeploy = async (e) => {
        e.preventDefault();
        if (selectedValueIndex === 0) {
            if (language !== "CN") {
                swal("Error", `Please Choose The Token Template You Want To Deploy`, "error")
                return;
            }
            swal("錯誤", `請選擇代幣類型`, "error")
            return;
        }
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
        deploy(selectedValueIndex)
    }



    const texts = {
        title: language !== "CN" ? "Token Creator" : "一鍵發幣",
        module: language !== "CN" ? "Token Template" : "請選擇合約模板",
        description: language !== "CN" ? "Token Description" : "代幣說明",
    }



    const datas = [
        {
            position: 0,
            title: language !== "CN" ? "Token Name" : "代幣名稱",
            value: name,
            textType: "text",
            function: e => setName(e.target.value),
            style: styles2,
            placeholder: "Ethereum",
        },
        {
            position: 1,
            title: language !== "CN" ? "Token Symbol" : "代幣縮寫",
            value: symbol,
            textType: "text",
            function: e => setSymbol(e.target.value),
            style: styles2,
            placeholder: "ETH",
        },
        {
            position: 2,
            title: language !== "CN" ? "Token Decimal" : "代幣精度",
            value: decimal,
            textType: "number",
            function: e => setDecimal(e.target.value),
            style: styles2,
            placeholder: "0 ~ 18",
        },
        {
            position: 3,
            title: language !== "CN" ? "Token Supply" : "代幣供應量",
            value: totalSupply,
            textType: "number",
            function: e => setTotalSupply(e.target.value),
            style: styles2,
            placeholder: "1000000",
        },
        {
            position: 4,
            title: language !== "CN" ? "Base Currency" : "底池幣種",
            value: lpBaseToken,
            textType: "text",
            // function: e => setLpBaseToken(e.target.value),
            style: styles3,
            // placeholder: "1000000",
        },
        {
            position: 5,
            title: language !== "CN" ? "DEX" : "去中心化交易所",
            value: routerAddress,
            textType: "text",
            // function: e => setRouterAddress(e.target.value),
            style: styles3,
            // placeholder: "1000000",
        },
        {
            position: 6,
            title: language !== "CN" ? "Marketing Fee" : "營銷稅率",
            value: marketingFee,
            textType: "number",
            function: e => setMarketingFee(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
        {
            position: 7,
            title: language !== "CN" ? "Liquidity Fee" : "回流稅率",
            value: liquidityFee,
            textType: "number",
            function: e => setLiquidityFee(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
        {
            position: 8,
            title: language !== "CN" ? "Marketing Wallet" : "營銷錢包",
            value: marketingWallet,
            textType: "text",
            function: e => setMarketingWallet(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
        // {
        //     position: 9,
        //     title: language !== "CN" ? "Reflection Fee" : "分紅稅率",
        //     value: rewardFee,
        //     textType: "number",
        //     function: e => setRewardFee(e.target.value),
        //     style: styles2,
        //     // placeholder: "1000000",
        // },
        // {
        //     position: 10,
        //     title: language !== "CN" ? "Reflection Token" : "分紅代幣",
        //     value: rewardToken,
        //     textType: "text",
        //     function: e => setRewardToken(e.target.value),
        //     style: styles2,
        //     // placeholder: "1000000",
        // },
    ]

    const toggleDropdown = (value) => {
        if (value === DROPDOWN.DROPDOWN_MODULE)
            setIsOpen(!isOpen);
        if (value === DROPDOWN.DROPDOWN_BASE)
            setIsBaseOpen(!isBaseOpen);
        if (value === DROPDOWN.DROPDOWN_SWAP)
            setIsSwapOpen(!isSwapOpen)
    };

    const handleOptionSelect = (value) => {
        setSelectedValue(moduleTypes[value].MODULE);
        setSelectedValueIndex(value)
        setIsOpen(false);
    };
    const handleBaseOptionSelect = (value) => {
        //設定前端 底池 的名字
        setSelectedBaseValue(baseOptionsWithChain[value].Name)
        //設定 底池 所相對應的數字
        setSelectedBaseValueIndex(value)
        //設定 底池 合約
        if (value !== 0) setLpBaseToken(baseOptionsWithChain[value].Contract)
        setIsBaseOpen(false);
    };

    const handleSwapOptionSelect = (value) => {
        //設定前端 Swap 的名字
        setSelectedSwapValue(swapOptionsWithChain[value].Name)
        //設定 Swap 所相對應的數字
        setSelectedSwapValueIndex(value)
        //設定 Swap 合約
        setRouterAddress(swapOptionsWithChain[value].Contract)
        setIsSwapOpen(false);
    };

    return (

        //  一鍵發幣 頁面

        <div style={{
            width: '92%',
            color: 'black',
            position: 'absolute',
            height: '85vh',
            overflowY: 'scroll',
            paddingLeft: '20px',
            border: '1px solid lightgray'
        }}>
            <div style={{ textAlign: 'left', paddingTop: '15px' }}>
                <h1>{texts.title} - V1</h1><br />
            </div>

            {/* --選擇代幣模板-- */}
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
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span
                        onClick={() => toggleDropdown(DROPDOWN.DROPDOWN_MODULE)}
                        style={{
                            marginLeft: '5vw',
                            backgroundColor: 'white',
                            border: '1px solid black',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            maxWidth: '220px',
                            width: '100%',
                            justifyContent: 'space-between',
                            display: 'flex',
                            flexDirection: 'row',
                            fontWeight: 'bold',
                            alignItems: 'center',
                            position: 'relative',
                            zIndex: '1',
                        }}>
                        <div>{selectedValue || texts.module}</div><div> ▼ </div>
                    </span>
                </div>
            </div>

            {/* --代幣模板選單-- */}
            {
                isOpen && (
                    <ul style={{ marginLeft: '5vw', zIndex: '1', position: 'absolute', backgroundColor: 'white', border: '1px solid black' }}>
                        {
                            moduleTypes.map((module, index) => {
                                if (index !== 0)
                                    return (
                                        <li
                                            onClick={() => {
                                                handleOptionSelect(index)
                                            }}
                                            key={index}
                                            style={{
                                                padding: '5px 10px',
                                                width: '220px',
                                                cursor: 'pointer',
                                            }}
                                        >{module.MODULE}
                                        </li>
                                    )
                            })
                        }
                    </ul>
                )
            }
            <p style={{
                marginLeft: '7vw',
                color: 'gray',
                width: '70%',
            }}>{moduleTypes[selectedValueIndex].Description}</p><br />

            {/* --一鍵發幣參數-- */}
            <div
                className="createContractWrapper"
                style={{
                    marginRight: '10vw',
                    marginBottom: '15px',
                }}>

                {
                    moduleTypes !== initModuleType && selectedValueIndex !== null &&
                    datas.map((data, index) => {
                        if (selectedValueIndex === 0)
                            return;
                        if (selectedValueIndex === 1)
                            if (index > 3) return;
                        if (selectedValueIndex === 2)
                            if (index > 9) return;
                        return (
                            <div key={index} style={styles}>
                                {/* 設置底池 */}
                                {
                                    index === 4 &&
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center' }}>
                                            <h4>{data.title}</h4>
                                        </div>
                                        <div
                                            style={data.style}
                                            onClick={() => toggleDropdown(DROPDOWN.DROPDOWN_BASE)}
                                        >
                                            {selectedBaseValue} <div> ▼ </div>
                                        </div>

                                        {
                                            isBaseOpen && (
                                                <ul style={{ zIndex: '1', position: 'absolute', backgroundColor: 'white', border: '1px solid black' }}>
                                                    {
                                                        baseOptionsWithChain.map((base, index) => {
                                                            return (
                                                                <li
                                                                    onClick={() => {
                                                                        handleBaseOptionSelect(index)
                                                                    }}
                                                                    key={index}
                                                                    style={{
                                                                        padding: '5px 10px',
                                                                        width: '220px',
                                                                    }}
                                                                >{base.Name}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            )
                                        }

                                    </div>
                                }

                                {/* 設置路由 */}
                                {
                                    index === 5 &&
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center' }}>
                                            <h4>{data.title}</h4>
                                        </div>
                                        <div
                                            style={data.style}
                                            onClick={() => toggleDropdown(DROPDOWN.DROPDOWN_SWAP)}
                                        >
                                            {selectedSwapValue} <div> ▼ </div>
                                        </div>

                                        {
                                            isSwapOpen && (
                                                <ul style={{ zIndex: '1', position: 'absolute', backgroundColor: 'white', border: '1px solid black' }}>
                                                    {
                                                        swapOptionsWithChain.map((swap, index) => {
                                                            return (
                                                                <li
                                                                    onClick={() => {
                                                                        handleSwapOptionSelect(index)
                                                                    }}
                                                                    key={index}
                                                                    style={{
                                                                        padding: '5px 10px',
                                                                        width: '220px',
                                                                    }}
                                                                >{swap.Name}</li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            )
                                        }

                                    </div>
                                }

                                {
                                    index !== 4 && index !== 5 &&
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center' }}>
                                            <h4>{data.title}</h4>
                                            {
                                                index === 10 &&
                                                <span style={{ textAlign: 'right' }}>
                                                    {nameSymbol}
                                                </span>
                                            }
                                        </div>
                                        <input
                                            text={data.textType}
                                            value={data.value}
                                            onChange={data.function}
                                            style={data.style}
                                            placeholder={data.placeholder}
                                        />
                                    </div>
                                }
                            </div>
                        )
                    })
                }
            </div>

            <button onClick={beforedeploy}
                style={styles2 && { width: '80%', paddingBottom: '50px' }}
            >{language === "CN" ? "創建代幣" : "Create Token"}</button>
        </div>
    )
}

export default Create
