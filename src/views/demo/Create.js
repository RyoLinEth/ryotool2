import React, { useState, useEffect } from 'react'
import TokenDescription from './TokenDescription'
import useLocale from 'utils/hooks/useLocale'
import swal from 'sweetalert';
import { Dropdown } from 'components/ui'
import DropdownItem from 'components/ui/Dropdown/DropdownItem';
import { useSelector } from 'react-redux'
// import { NORMAL_ABI, MARKETINGLP_Bep20Based_ABI } from './abi/contractABI'
import tokenABI from './abi/tokenABI.json'
import { ethers } from 'ethers'
import { moduleTypesEN, moduleTypesCN } from './CreateData';
import { Market_LP_BNB_Module } from './bytecode/bytecode';

const defaultRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const defaultReward = [
    {
        Contract: "0x55d398326f99059fF775485246999027B3197955",
        Name: "USDT"
    }
]

// const contractAddress = {
//     Normal: '0x4C78b4e54149bDCDc767961F5910c609343063f8',
//     MARKETINGLP_Bep20Based: '0xAFB4A1cD95CE79761BBE7Ee4b34297fF0899831a'
// }

const contractAddress = {
    Normal: '0x8706B184D46d95Bee27FABAE45E0121B831a8718',
    MARKETINGLP_Bep20Based: '0x8706B184D46d95Bee27FABAE45E0121B831a8718'
}

const defaultBase = {
    BSC: {
        BNB: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
        USDT: '0x55d398326f99059fF775485246999027B3197955',
    },
    BSCTest: {
        USDT: '0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684'
    }
}

const Create = () => {
    let language = useLocale();
    const account = useSelector(state => state.theme.defaultAccount);
    const chainID = useSelector(state => state.theme.chainID);

    const initModuleType = [
        {
            MODULE: language === "CN" ? "請選擇合約模板" : "Choose Token Type"
        }
    ]
    const ERRORSTATE = {
        STATE_1: language === "CN" ? "代幣地址異常" : "Token Not Found",
        STATE_2: language === "CN" ? "並非合約地址" : "Not A Contract"
    }

    const BaseOptions = {
        OKC: [
            {
                name: "OKT",
            },
            {
                name: "USDT",
                contract: "0x382bB369d343125BfB2117af9c149795C6C65C50"
            }
        ],
        BSC: [
            {
                name: "BNB",
            },
            {
                name: "USDT",
                contract: "0x55d398326f99059fF775485246999027B3197955"
            }
        ],
        BSCTest: [
            {
                name: "BNB",
            },
            {
                name: "USDT",
                contract: "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"
            }
        ]
    }

    const SwapOptions =
    {
        BSC: [
            {
                name: language === "CN" ? "薄餅" : "PancakeSwap",
                contract: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
            },
            {
                name: language === "CN" ? "JSwap" : "JSwap",
                contract: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3"
            }
        ],
        BSCTest : [
            {
                name: language === "CN" ? "薄餅" : "PancakeSwap",
                contract: "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"
            },
        ],
        OKC : [
            {
                name: language === "CN" ? "JSwap" : "JSwap",
                contract: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3"
            }
        ]
    }
    // const SwapOptions = [
    //     {
    //         name: language === "CN" ? "薄餅" : "PancakeSwap",
    //         contract: "0x10ED43C718714eb63d5aA57B78B54704E256024E"
    //     },
    //     {
    //         name: language === "CN" ? "JSwap" : "JSwap",
    //         contract: "0x069A306A638ac9d3a68a6BD8BE898774C073DCb3"
    //     }
    // ]

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

    /*
            ===================================
            ===================================
     
                USE STATE START    
     
            ===================================
            ===================================
    */
    const [moduleTypes, setModuleTypes] = useState(initModuleType)
    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [decimal, setDecimal] = useState('');
    const [totalSupply, setTotalSupply] = useState('');
    const [routerAddress, setRouterAddress] = useState(defaultRouter);
    const [marketingFee, setMarketingFee] = useState(0);
    const [liquidityFee, setLiquidityFee] = useState(0);
    const [rewardFee, setRewardFee] = useState(0);
    const [rewardToken, setRewardToken] = useState(defaultReward[0].Contract);
    const [marketingWallet, setMarketingWallet] = useState('');
    const [lpBaseToken, setLpBaseToken] = useState('');

    const [provider, setProvider] = useState(null)
    const [signer, setSigner] = useState(null)
    const [normalContract, setNormalContract] = useState(null)
    const [MARKETINGLP_Bep20Contract, setMARKETINGLP_Bep20Contract] = useState(null)
    const [nameSymbol, setNameSymbol] = useState("USDT");

    const [isOpen, setIsOpen] = useState(false);
    const [isBaseOpen, setIsBaseOpen] = useState(false);
    const [isSwapOpen, setIsSwapOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(moduleTypes[0].MODULE);
    const [selectedValueIndex, setSelectedValueIndex] = useState(0);

    const [baseOptionsWithChain, setBaseOptionsWithChain] = useState([]);
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

        let tempNormalContract = new ethers.Contract(contractAddress.Normal, NORMAL_ABI, tempSigner)
        setNormalContract(tempNormalContract);

        let tempMARKETINGLP_Bep20Contract = new ethers.Contract(contractAddress.MARKETINGLP_Bep20Based, MARKETINGLP_Bep20Based_ABI, tempSigner)
        setMARKETINGLP_Bep20Contract(tempMARKETINGLP_Bep20Contract);
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
        console.log("chainID : " + chainID)
        if (chainID === chainOptions.bsc) {
            setSelectedBaseValue(BaseOptions.BSC.name)
            setBaseOptionsWithChain(BaseOptions.BSC)
            setSelectedSwapValue(SwapOptions.BSC.name)
            setSwapOptionsWithChain(SwapOptions.BSC)
        }
        if (chainID === chainOptions.bsctest) {
            setSelectedBaseValue(BaseOptions.BSCTest.name)
            setBaseOptionsWithChain(BaseOptions.BSCTest)
            setSelectedSwapValue(SwapOptions.BSCTest.name)
            setSwapOptionsWithChain(SwapOptions.BSCTest)
        }
        if (chainID === chainOptions.okc) {
            setSelectedBaseValue(BaseOptions.OKC.name)
            setBaseOptionsWithChain(BaseOptions.OKC)
            setSelectedSwapValue(SwapOptions.OKC.name)
            setSwapOptionsWithChain(SwapOptions.OKC)
        }
    }, [chainID])

    useEffect(() => {
        if (rewardToken === defaultReward[0].Contract) {
            setNameSymbol("USDT")
            return;
        }
        if (rewardToken.length === 42) {
            updateReward(rewardToken)
        }
        if (rewardToken.length !== 42) {
            if (nameSymbol !== ERRORSTATE.STATE_1)
                setNameSymbol(ERRORSTATE.STATE_1)
        }
    }, [rewardToken])

    useEffect(() => {
        if (account !== null)
            updateEthers()
    }, [account, chainID])

    useEffect(() => {
        if (language === "CN") {
            setModuleTypes(moduleTypesCN)
            setSelectedValue(moduleTypesCN[selectedValueIndex].MODULE);
            // setSelectedSwapValue(swapOptionsWithChain[selectedSwapValueIndex].name)
            return;
        }
        setModuleTypes(moduleTypesEN)
        setSelectedValue(moduleTypesEN[selectedValueIndex].MODULE);
        // setSelectedSwapValue(swapOptionsWithChain[selectedSwapValueIndex].name)
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
                let result = await normalContract.deploy(
                    name,
                    symbol,
                    decimal,
                    totalSupply
                )
                console.log(result)
            } catch (err) {
                console.log(err)
            }
        /* 營銷回流模板 */
        if (value === 2) {
            /* 選定BNB 模板 */
            if (selectedBaseValueIndex === 0) { }

            /* 選定其他底池模板 */
            /* USDT模板 */
            if (selectedBaseValueIndex === 1) { }
            try {
                let result = await MARKETINGLP_Bep20Contract.deploy(
                    routerAddress,
                    baseOptionsWithChain[selectedBaseValueIndex].contract,
                    name,
                    symbol,
                    [marketingFee * 100, liquidityFee * 100],
                    [marketingFee * 100, liquidityFee * 100],
                    decimal,
                    totalSupply,
                    marketingWallet
                )
                console.log(result)
            } catch (err) {
                console.log(err)
            }
        }

    }

    const beforedeploy = async (e) => {
        e.preventDefault();
        if (selectedValueIndex === 0) {
            if (language !== "CN") {
                swal("Error", `Please Choose The Token Type You Want To Deploy`, "error")
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
        module: language !== "CN" ? "Token Type" : "請選擇合約模板",
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
            placeholder: "Eth",
        },
        {
            position: 2,
            title: language !== "CN" ? "Token Decimal" : "代幣精度",
            value: decimal,
            textType: "number",
            function: e => setDecimal(e.target.value),
            style: styles2,
            placeholder: "18",
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
            title: language !== "CN" ? "Router Address" : "底池",
            value: lpBaseToken,
            textType: "text",
            function: e => setLpBaseToken(e.target.value),
            style: styles3,
            // placeholder: "1000000",
        },
        {
            position: 5,
            title: language !== "CN" ? "Router Address" : "路由地址",
            value: routerAddress,
            textType: "text",
            function: e => setRouterAddress(e.target.value),
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
        {
            position: 9,
            title: language !== "CN" ? "Reflection Fee" : "分紅稅率",
            value: rewardFee,
            textType: "number",
            function: e => setRewardFee(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
        {
            position: 10,
            title: language !== "CN" ? "Reflection Token" : "分紅代幣",
            value: rewardToken,
            textType: "text",
            function: e => setRewardToken(e.target.value),
            style: styles2,
            // placeholder: "1000000",
        },
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
        setSelectedBaseValue(baseOptionsWithChain[value].name);
        setSelectedBaseValueIndex(value)
        setIsBaseOpen(false);
    };
    const handleSwapOptionSelect = (value) => {
        setSelectedSwapValue(swapOptionsWithChain[value].name);
        setSelectedSwapValueIndex(value)
        setIsSwapOpen(false);
    };

    return (
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
                    <div>
                        {texts.description}
                    </div>
                </h5>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
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
                                        >{module.MODULE}</li>
                                    )
                            })
                        }
                    </ul>
                )
            }
            <br />

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
                            if (index > 7) return;
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
                                            {selectedBaseValue || baseOptionsWithChain[0].name} <div> ▼ </div>
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
                                                                >{base.name}</li>
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
                                            {selectedSwapValue || swapOptionsWithChain[0].name} <div> ▼ </div>
                                        </div>

                                        {
                                            isSwapOpen && (
                                                <ul style={{ zIndex: '1', position: 'absolute', backgroundColor: 'white', border: '1px solid black' }}>
                                                    {
                                                        swapOptionsWithChain.map((base, index) => {
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
                                                                >{base.name}</li>
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
                                {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '90%', alignItems: 'center' }}>
                                    <h4>{data.title}</h4>
                                    {
                                        index === 9 &&
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
                                /> */}
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
