import React from 'react'
import {
    HiOutlineColorSwatch,
    HiOutlineDesktopComputer,
    HiOutlineTemplate,
    HiOutlineViewGridAdd,
    HiOutlineHome,
    HiCurrencyDollar,
    HiOutlineArrowsExpand,
    HiDesktopComputer,
} from 'react-icons/hi'

const navigationIcon = {
    home: <HiOutlineHome />,
    singleMenu: <HiOutlineViewGridAdd />,
    collapseMenu: <HiOutlineTemplate />,
    groupSingleMenu: <HiOutlineDesktopComputer />,
    groupCollapseMenu: <HiOutlineColorSwatch />,
    tokenCreate: <HiCurrencyDollar />,
    batch: <HiOutlineArrowsExpand />,
    tokenControl: <HiDesktopComputer />,
}

export default navigationIcon