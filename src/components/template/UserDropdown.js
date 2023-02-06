import React, { useState, useEffect } from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
// import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import useLocale from 'utils/hooks/useLocale'
import { useDispatch } from 'react-redux';
import { setPublicAddress } from 'store/theme/themeSlice'

const okcNetWorkID = '0x42'
const bscNetWorkID = '0x38'
const bsctestNetWorkID = '0x61'

export const UserDropdown = ({ className }) => {
	let language = useLocale();
	const dispatch = useDispatch();
	const defaultConnectWallet = "連接錢包"

	const [defaultAccount, setDefaultAccount] = useState(null)
	const [correctNetwork, setCorrectNetwork] = useState(null);
	const [connectButtonText, setConnectButtonText] = useState(defaultConnectWallet)
	const [net, setNet] = useState("Network")

	const dropdownItemList = [
		{
			label: language === "CN" ? "代幣控制台" : "Control Panel",
			path: `/controlpanel`
		},
		{
			label: language === "CN" ? "BSC瀏覽器" : "BSCScan",
			to: `https://bscscan.com/address/${defaultAccount}`
		},
		{
			label: language === "CN" ? "BSC測試網瀏覽器" : "BSCScan Testnet",
			to: `https://testnet.bscscan.com/address/${defaultAccount}`
		},
	]

	useEffect(() => {
		changingAccount();
		dispatch(setPublicAddress(defaultAccount));
		checkCorrectNetwork();
		if (defaultAccount !== null) return;
		if (language === "CN") {
			setConnectButtonText("連接錢包")
			return;
		}
		setConnectButtonText("Connect Wallet")
	}, [defaultAccount, language])

	async function changingAccount() {
		if (window.ethereum) {
			window.ethereum.on('accountsChanged', () => {
				connectWalletHandler()
			})
		}
	}

	const connectWalletHandler = async () => {
		if (window.ethereum) {
			window.ethereum.request({ method: 'eth_requestAccounts' })
				.then(async (result) => {
					await accountChangeHandler(result[0]);
					setConnectButtonText(`${result[0].slice(0, 4)}...${result[0].slice(-4)}`);
				})
		} else {
			alert('Need to install MetaMask!')
		}
	}

	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		console.log('Connected to chain:' + chainId)

		if (chainId === okcNetWorkID) {
			setNet("OKC")
			return;
		}
		if (chainId === bscNetWorkID) {
			setNet("BSC")
			return;
		}
		if (chainId === bsctestNetWorkID) {
			setNet("BSC Test")
			return;
		}
		setNet(language === "CN" ? "未知網路" : "Unknown")
	}

	const accountChangeHandler = async (newAccount) => {
		setDefaultAccount(newAccount);
	}

	const UserAvatar = (
		<div className={classNames(className, 'flex items-center gap-2')}>
			<Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
			<div>
				<div className="text-xs capitalize">
					{net}
					{/* {
						language === "CN" ? "會員中心" : "Member Center"
					} */}
				</div>
				<div className="font-bold">{connectButtonText}</div>
			</div>
		</div>
	)

	return (
		<div>
			<Dropdown menuStyle={{ minWidth: 240 }} renderTitle={UserAvatar} placement="bottom-end" onClick={connectWalletHandler}>
				<Dropdown.Item variant="header">
					<div className="py-2 px-3 flex items-center gap-2">
						{/* <Avatar shape="circle" icon={<HiOutlineUser />} /> */}
						<div>
							<div className="font-bold text-gray-900 dark:text-gray-100">
								查看個人檔案
							</div>
							<div className="text-xs">See personal info</div>
						</div>
					</div>
				</Dropdown.Item>
				<Dropdown.Item variant="divider" />
				{dropdownItemList.map(item => (
					<Dropdown.Item eventKey={item.label} key={item.label} className="mb-1">
						{
							item.path === undefined &&
							<a className="flex gap-2 items-center" href={item.to}>
								<span className="text-xl opacity-50">{item.icon}</span>
								<span>{item.label}</span>
							</a>
						}
						{
							item.path !== undefined &&
							<Link className="flex gap-2 items-center" to={item.path}>
								<span className="text-xl opacity-50">{item.icon}</span>
								<span>{item.label}</span>
							</Link>
						}
						{/* <a className="flex gap-2 items-center" to={item.path}>
							<span className="text-xl opacity-50">{item.icon}</span>
							<span>{item.label}</span>
						</a> */}
					</Dropdown.Item>
				))}
			</Dropdown>
		</div>
	)
}

export default withHeaderItem(UserDropdown)
