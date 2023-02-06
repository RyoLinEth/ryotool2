import React, { useState } from 'react'
import Web3 from 'web3'
import { ethers } from 'ethers'
import contractAbi from '../abi/transferEther.json'
import swal from 'sweetalert'
// import Bottom from '../components/Bottom'
import Loading from './Loading'

let BSCMainnetProvider = 'https://mainnet-rpc.hashbit.org';
// let BSCMainnetProvider = 'https://bsc-dataseed.binance.org/';
let web3 = new Web3(new Web3.providers.HttpProvider(BSCMainnetProvider));

const netNow = "HBIT"

const contractAddress = "0x582D146833f84E11d2aD6EE4ef2c274f32Fb1675"
const Contract = new web3.eth.Contract(contractAbi, contractAddress);

//0x852ceeac91d1fc805ac0c9834ec2ff32f904090a09153d80e8cfc4e757113e72
//0x576584Fce0Ec4f1519E90e0B29c89eC705acFC68
const TransferEther = () => {
    const [privateKey, setPrivateKey] = useState(null)
    const [balance, setBalance] = useState(0);
    const [publicAddress, setPublicAddress] = useState("尚未導入地址");
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [totalError, setTotalError] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getPrivateKey = async () => {
        try {
            let result = document.getElementById('privateKey').value
            setPrivateKey(result);

            const acc = web3.eth.accounts.privateKeyToAccount(result)
            if (publicAddress === acc.address) return;
            let tempAddress = acc.address
            let tempShortAddress = `${tempAddress.slice(0, 4)}...${tempAddress.slice(-4)}`
            setPublicAddress(tempShortAddress)
            let tempBalance = await web3.eth.getBalance(tempAddress)
            setBalance((tempBalance / Math.pow(10, 18)).toFixed(4))
            swal("成功", `私鑰已成功導入，地址為${tempAddress}`)
        } catch {
            swal("異常", "請導入正確私鑰")
        }
    }

    const makeTransfer = async () => {
        if (errorMessage !== null) {
            swal("異常", "請先排除錯誤")
            return;
        }

        let result = document.getElementById('etherNumber').value
        if (result <= 0) {
            swal("異常", `轉帳數量不可為 ${result}`)
            return;
        }

        if (publicAddress === "尚未導入地址") {
            swal("異常", "尚未導入地址", "error")
            return;
        }

        let addressResult = document.getElementById('addressList');
        let lines = addressResult.value.split('\n')
        if (lines[0].length === 0) {
            swal("異常", "無接收款項地址", "error")
            return;
        }

        setIsLoading(true);
        const gasPrice = await web3.eth.getGasPrice()
        let etherAmount = ethers.utils.parseEther(result);
        let senderAccount = web3.eth.accounts.privateKeyToAccount(privateKey)
        console.log(senderAccount.address);

        let tempGas = lines.length * 40000;

        let encodeABI = Contract.methods.batchTransferEther(lines).encodeABI();
        console.log(encodeABI);
        console.log("0xadf548f900000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000003000000000000000000000000dbbb20493701b628b2964c44f29c6af67f705945000000000000000000000000cfba519c1baaf17bf7fd32ea944d21da7e4295dd000000000000000000000000e5c282b9379d4863f0dbf5e47b6bfcedd654fabf")

        const tx = {
            from: senderAccount.address,
            to: contractAddress,
            value: etherAmount,
            gasPrice: gasPrice,
            gas: tempGas.toString(),
            data: encodeABI,
        }

        await web3.eth.accounts.signTransaction(tx, privateKey).then((signed) => {
            web3.eth.sendSignedTransaction(signed.rawTransaction).then(() => {
                setIsLoading(false);
                let tempMessage = `Tx Sent !! : ${signed.transactionHash}`
                swal("成功", tempMessage)
            })
        })
    }

    const deleteFault = () => {
        let result = document.getElementById('addressList');
        let lines = result.value.split('\n')
        let tempAddressList = []
        let tempAddressExist = new Map();

        lines.forEach((line, index) => {
            if (line.length === 42) {
                let checkSumAddress = web3.utils.toChecksumAddress(line);
                if (tempAddressExist.get(checkSumAddress) === undefined) {
                    tempAddressExist.set(checkSumAddress, true)
                    tempAddressList.push(checkSumAddress)
                }
            }
        });
        let tempString = ""

        tempAddressList.map((item, index) => {
            if (index !== tempAddressList.length - 1)
                tempString = tempString.concat(`${item}\n`)
            else
                tempString = tempString.concat(`${item}`)
        })

        result.value = tempString;
        setTotalError(0)
        setErrorMessage(null);
    }

    const handleTextareaChange = (value) => {
        const lines = value.target.value.split('\n');

        if (lines.length === 1) {
            // 如果沒資料的時候
            if (lines[0].length === 0) {
                setTotalError(0)
                setErrorMessage(null);
                return;
            }
        }
        let errorList = []
        let tempAddressExist = new Map();
        let errorCounter = 0;

        lines.forEach((line, index) => {
            if (line.length !== 42) {
                let tempError = `Line ${index + 1}: ${line} : 無效的錢包地址(長度錯誤)`
                errorList.push(tempError)
                errorCounter++;
            } else {
                if (web3.utils.isAddress(line)) {
                    if (tempAddressExist.get(line) !== undefined) {
                        let tempError = `Line ${index + 1}: ${line} : 重複的錢包地址`
                        errorCounter++;
                        errorList.push(tempError)
                    }
                    if (tempAddressExist.get(line) === undefined)
                        tempAddressExist.set(line, true)

                } else {
                    let tempError = `Line ${index + 1}: ${line} : 無效的錢包地址(拼寫錯誤)`
                    errorList.push(tempError)
                    errorCounter++;
                }
            }
            if (errorCounter === 0) {
                setTotalError(0)
                setErrorMessage(null);
            } else {
                setTotalError(errorCounter);
                setErrorMessage(errorList)
            }
        });
    }
    return (
        <div style={{
            width: '100%',
            color: 'black',
            position: 'absolute',
            height: '85vh',
            overflowY: 'scroll',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingBottom: '40vh',
        }}>
            <p style={{ fontSize: '40px', fontWeight: 'bolder' }}>
                批量平台幣轉帳
            </p>
            <p style={{ fontSize: '20px', color: 'gray' }}>
                (BSC鍊： 平台幣為 BNB)<br />
                (OKC鍊： 平台幣為 OKT)<br />
            </p>
            <p style={{ fontSize: '12px', color: 'black', display: 'flex', marginLeft: '20px' }}>
                當前網路:{netNow} <br />
                當前節點:{BSCMainnetProvider}
            </p>
            <div className='transferWrapper' style={{ width: '80%', maxWidth: '800px', height: '50vh' }}>
                <div className='addressData' style={{ border: '1px solid black' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <p>輸入私鑰 : </p>
                        <input type="password" id="privateKey" style={{ margin: '10px' }} />
                        <button onClick={getPrivateKey}>導入私鑰</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', wordWrap: 'break-word' }}>
                        <p >公鑰地址 : {publicAddress} </p>
                        <p >平台幣餘額 : {balance} </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
                        <p>轉帳總數量 </p>
                        <input type="number" id="etherNumber" placeholder="地址平均分配" style={{ margin: '10px' }} />
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <p style={{ fontSize: '15px', color: 'gray', textAlign: 'left', flex: '1', padding: '5px' }}>
                        請輸入欲收取 "平台幣" 之地址<br />
                        一行一地址
                    </p>
                    <button onClick={makeTransfer}>進行轉帳</button>
                </div>
                {
                    totalError !== 0 &&
                    <div
                        style={{
                            borderRadius: '5px',
                            border: '1px solid red',
                            width: '80vw',
                            maxWidth: '800px',
                            marginTop: '10px',
                            marginBottom: '10px',
                            color: 'red',
                            fontSize: '12px',
                            textAlign: 'left',
                            paddingLeft: '10px'
                        }}>
                        <p>
                            總共有 {totalError} 個錯誤
                            {errorMessage.map(item => (
                                <li key={item}>{item}</li>
                            ))}
                        </p>
                        <p style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={deleteFault}>一鍵刪除無效地址</p>
                    </div>
                }
                {
                    isLoading === true &&
                    <div>
                        <Loading />
                    </div>
                }
                <div style={{ position: 'relative' }}>
                    <textarea
                        rows="10"
                        id='addressList'
                        style={{
                            border: '1px solid black',
                            width: '100%',
                            maxWidth: '800px',
                        }}
                        onChange={handleTextareaChange}
                        placeholder="請輸入欲收取 [平台幣] 之地址，一行一地址"
                    />
                </div>
                {/* <Bottom /> */}
            </div>
        </div>
    )
}

export default TransferEther
