import React from 'react'
import { Menu, Tooltip } from 'components/ui'
import VerticalMenuIcon from './VerticalMenuIcon'
import { Link } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { AuthorityCheck } from 'components/shared'
import useLocale from 'utils/hooks/useLocale'

const { MenuItem } = Menu

const CollapsedItem = ({ title, translateKey, children, direction }) => {
	const { t } = useTranslation()

	let language = useLocale();

	return (
		<Tooltip
			title={
				language === "CN" ? title : translateKey
			}
			placement={direction === 'rtl' ? 'left' : 'right'}
		>
			{children}
		</Tooltip>
	)
}

const DefaultItem = (props) => {
	const { nav, onLinkClick, sideCollapsed, userAuthority } = props

	let language = useLocale();

	return (
		<AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
			<MenuItem key={nav.key} eventKey={nav.key} className="mb-2">
				<Link
					to={nav.path}
					onClick={() => onLinkClick?.({
						key: nav.key,
						title: language === "CN" ? nav.title : nav.translateKey,
						path: nav.path,
					})}
					className="flex items-center h-full w-full"
				>
					<VerticalMenuIcon icon={nav.icon} />
					{!sideCollapsed && (
						<span>
							{
								language === "CN" ? nav.title : nav.translateKey
							}
						</span>
					)}
				</Link>
			</MenuItem>
		</AuthorityCheck>
	)
}

const VerticalSingleMenuItem = ({ nav, onLinkClick, sideCollapsed, userAuthority, direction }) => {

	return (
		<AuthorityCheck userAuthority={userAuthority} authority={nav.authority}>
			{
				sideCollapsed ? (
					<CollapsedItem
						title={nav.title}
						translateKey={nav.translateKey}
						direction={direction}
					>
						<DefaultItem
							nav={nav}
							sideCollapsed={sideCollapsed}
							onLinkClick={onLinkClick}
							userAuthority={userAuthority}
						/>
					</CollapsedItem>
				)
					:
					(
						<DefaultItem
							nav={nav}
							sideCollapsed={sideCollapsed}
							onLinkClick={onLinkClick}
							userAuthority={userAuthority}
						/>
					)
			}
		</AuthorityCheck>
	)
}

export default VerticalSingleMenuItem
