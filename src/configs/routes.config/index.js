import React from 'react'
import authRoute from './authRoute'

export const publicRoutes = [
    ...authRoute
]

export const protectedRoutes = [
    {
        key: 'home',
        path: '/home',
        component: React.lazy(() => import('views/Home')),
        authority: [],
    },
    /** Example purpose only, please remove */
    // {
    //     key: 'singleMenuItem',
    //     path: '/single-menu-view',
    //     component: React.lazy(() => import('views/demo/SingleMenuView')),
    //     authority: [],
    // },

    /*  
    ======================
    ======================
        批量功能頁面    
    ======================
    ======================
    */
    {
        key: 'singleMenuItem2',
        path: '/single-menu-view2',
        component: React.lazy(() => import('views/demo/SingleMenuView2')),
        authority: [],
    },
    /*  
    ======================
    ======================
        批量功能頁面    
    ======================
    ======================
    */
   
    {
        key: 'create',
        path: '/createV1',
        component: React.lazy(() => import('views/demo/Create3')),
        authority: [],
    },
    {
        key: 'controlpanel',
        path: '/controlpanel',
        component: React.lazy(() => import('views/demo/ControlPanel')),
        authority: [],
    },
    // {
    //     key: 'collapseMenu.item1',
    //     path: '/collapse-menu-item-view-1',
    //     component: React.lazy(() => import('views/demo/CollapseMenuItemView1')),
    //     authority: [],
    // },
    // {
    //     key: 'collapseMenu.item2',
    //     path: '/collapse-menu-item-view-2',
    //     component: React.lazy(() => import('views/demo/CollapseMenuItemView2')),
    //     authority: [],
    // },
    {
        key: 'collapseMenu2.item2-1',
        path: '/collapse-menu-item-view2-1',
        component: React.lazy(() => import('views/demo/CollapseMenuItemView2-1')),
        authority: [],
    },
    {
        key: 'collapseMenu2.item2-2',
        path: '/collapse-menu-item-view2-2',
        component: React.lazy(() => import('views/demo/CollapseMenuItemView2-2')),
        authority: [],
    },
    {
        key: 'groupMenu.single',
        path: '/group-single-menu-item-view',
        component: React.lazy(() => import('views/demo/GroupSingleMenuItemView')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item1',
        path: '/group-collapse-menu-item-view-1',
        component: React.lazy(() => import('views/demo/GroupCollapseMenuItemView1')),
        authority: [],
    },
    {
        key: 'groupMenu.collapse.item2',
        path: '/group-collapse-menu-item-view-2',
        component: React.lazy(() => import('views/demo/GroupCollapseMenuItemView2')),
        authority: [],
    },
    {
        key: 'transferEther',
        path: '/transferether',
        component: React.lazy(() => import('views/demo/TransferEther')),
        authority: [],
    },
]