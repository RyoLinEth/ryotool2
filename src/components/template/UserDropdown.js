import React, { useState, useEffect } from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
// import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'
import WalletConnect from './WalletConnect'

const dropdownItemList = [
]

export const UserDropdown = ({ className }) => {

	const defaultConnectWallet = "Connect Wallet"

	const [defaultAccount, setDefaultAccount] = useState(null)
	const [correctNetwork, setCorrectNetwork] = useState(null);
	const [connectButtonText, setConnectButtonText] = useState(defaultConnectWallet)

	useEffect(() => {
		changingAccount();
	}, [defaultAccount])

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

	const accountChangeHandler = async (newAccount) => {
		checkCorrectNetwork();
		setDefaultAccount(newAccount);
	}

	const checkCorrectNetwork = async () => {
		const { ethereum } = window
		let chainId = await ethereum.request({ method: 'eth_chainId' })
		// console.log('Connected to chain:' + chainId)

		// const netWorkID = '0x42'
		const netWorkID = '0x38'

		if (chainId !== netWorkID) {
			setCorrectNetwork(false)
		} else {
			setCorrectNetwork(true)
		}
	}

	const UserAvatar = (
		<div className={classNames(className, 'flex items-center gap-2')}>
			<Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
			<div className="hidden md:block">
				<div className="text-xs capitalize">Member Center</div>
				<div className="font-bold">{connectButtonText}</div>
			</div>
		</div>
	)

	return (
		<div>
			<Dropdown menuStyle={{ minWidth: 240 }} renderTitle={UserAvatar} placement="bottom-end" onClick={connectWalletHandler}>
				<Dropdown.Item variant="header">
					<div className="py-2 px-3 flex items-center gap-2">
						<Avatar shape="circle" icon={<HiOutlineUser />} />
						<div>
							<div className="font-bold text-gray-900 dark:text-gray-100">Member Center</div>
							<div className="text-xs">See personal info</div>
						</div>
					</div>
				</Dropdown.Item>
				<Dropdown.Item variant="divider" />
				{dropdownItemList.map(item => (
					<Dropdown.Item eventKey={item.label} key={item.label} className="mb-1">
						<Link className="flex gap-2 items-center" to={item.path}>
							<span className="text-xl opacity-50">{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					</Dropdown.Item>
				))}
			</Dropdown>
		</div>
	)
}

export default withHeaderItem(UserDropdown)
