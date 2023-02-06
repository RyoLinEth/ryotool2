import React, { useEffect, useState } from 'react'
import { Dropdown } from 'components/ui'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'
import { useTranslation } from 'react-i18next'
import useLocale from 'utils/hooks/useLocale'

const HorizontalMenuDropdownItem = ({ nav }) => {
	const { title, translateKey, path, key } = nav

	const [itemTitle, setItemTitle] = useState(title)

	let language = useLocale();

	useEffect(() => {
		if (language === "CN")
			setItemTitle(title)
		else
			setItemTitle(translateKey)
	}, [language])

	return (
		<Dropdown.Item eventKey={key} >
			{path
				?
				<HorizontalMenuNavLink path={path}>
					{itemTitle}
				</HorizontalMenuNavLink>
				:
				<span>{itemTitle}</span>
			}
		</Dropdown.Item>
	)
}

export default HorizontalMenuDropdownItem