import { 
    NAV_ITEM_TYPE_TITLE, 
    NAV_ITEM_TYPE_COLLAPSE, 
    NAV_ITEM_TYPE_ITEM 
} from 'constants/navigation.constant'

const navigationConfig = [
    {
        key: '首頁',
		path: '/home',
		title: '首頁',
		translateKey: 'Home',
		icon: 'home',
		type: NAV_ITEM_TYPE_ITEM,
		authority: [],
        subMenu: []
    },
    /** Example purpose only, please remove */
    // {
    //     key: 'singleMenuItem',
	// 	path: '/single-menu-view',
	// 	title: 'singleMenuItem',
	// 	translateKey: 'nav.singleMenuItem',
	// 	icon: 'singleMenu',
	// 	type: NAV_ITEM_TYPE_ITEM,
	// 	authority: [],
    //     subMenu: []
    // },
    {
        key: '批量工具',
		path: '/single-menu-view2',
		title: '批量工具',
		translateKey: 'Batch Tool',
		icon: 'batch',
		type: NAV_ITEM_TYPE_ITEM,
		authority: [],
        subMenu: []
    },
    {
        key: '一鍵發幣',
		path: '/createV1',
		title: '一鍵發幣',
		translateKey: 'Token Creator',
		icon: 'tokenCreate',
		type: NAV_ITEM_TYPE_ITEM,
		authority: [],
        subMenu: []
    },
    {
        key: '代幣控制台',
		path: '/controlpanel',
		title: '代幣控制台',
		translateKey: 'Token Control Panel',
		icon: 'tokenControl',
		type: NAV_ITEM_TYPE_ITEM,
		authority: [],
        subMenu: []
    },
    // {
    //     key: 'collapseMenu',
	// 	path: '',
	// 	title: 'Collapse Menu',
	// 	translateKey: 'nav.collapseMenu.collapseMenu',
	// 	icon: 'collapseMenu',
	// 	type: NAV_ITEM_TYPE_COLLAPSE,
	// 	authority: [],
    //     subMenu: [
    //         {
    //             key: 'collapseMenu.item1',
    //             path: '/collapse-menu-item-view-1',
    //             title: 'Collapse menu item 1',
    //             translateKey: 'nav.collapseMenu.item1',
    //             icon: '',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: []
    //         },
    //         {
    //             key: 'collapseMenu.item2',
    //             path: '/collapse-menu-item-view-2',
    //             title: 'Collapse menu item 2',
    //             translateKey: 'nav.collapseMenu.item2',
    //             icon: '',
    //             type: NAV_ITEM_TYPE_ITEM,
    //             authority: [],
    //             subMenu: []
    //         },
    //     ]
    // },
    {
        key: '下拉式選單2',
		path: '',
		title: '批量工具',
		translateKey: '批量工具',
		icon: 'collapseMenu',
		type: NAV_ITEM_TYPE_COLLAPSE,
		authority: [],
        subMenu: [
            {
                key: '下拉式選單2.item2-1',
                path: '/collapse-menu-item-view2-1',
                title: '下拉式選單2-1',
                translateKey: 'nav.collapseMenu2.下拉式選單2-1',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
            {
                key: '下拉式選單2.item2-2',
                path: '/collapse-menu-item-view2-2',
                title: '下拉式選單2-2',
                translateKey: 'nav.collapseMenu2.下拉式選單2-2',
                icon: '',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
        ]
    },
    {
		key: 'groupMenu',
		path: '',
		title: '群目錄',
		translateKey: 'Group Menu',
		icon: '',
		type: NAV_ITEM_TYPE_TITLE,
		authority: [],
		subMenu: [
            {
                key: 'groupMenu.single',
                path: '/group-single-menu-item-view',
                title: 'Group single menu item',
                translateKey: 'nav.groupMenu.single',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [],
                subMenu: []
            },
			{
				key: 'groupMenu.collapse',
				path: '',
				title: 'Group collapse menu',
				translateKey: 'nav.groupMenu.collapse.collapse',
				icon: 'groupCollapseMenu',
				type: NAV_ITEM_TYPE_COLLAPSE,
				authority: [],
				subMenu: [
					{
						key: 'groupMenu.collapse.item1',
						path: '/group-collapse-menu-item-view-1',
						title: 'Menu item 1',
						translateKey: 'nav.groupMenu.collapse.item1',
						icon: '',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [],
						subMenu: []
					},
                    {
						key: 'groupMenu.collapse.item2',
						path: '/group-collapse-menu-item-view-2',
						title: 'Menu item 2',
						translateKey: 'nav.groupMenu.collapse.item2',
						icon: '',
						type: NAV_ITEM_TYPE_ITEM,
						authority: [],
						subMenu: []
					},
                ]
            }
        ]
    }
]

export default navigationConfig