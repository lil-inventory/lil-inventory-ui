
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/inventory/:inventoryId', component: () => import('pages/InventoryPage.vue') },
      { path: '/inventory/create-inventory', component: () => import('pages/CreateInventoryPage.vue') },
      { path: '/inventory/:inventoryId/create-group', component: () => import('pages/CreateGroupPage.vue') },
      { path: '/inventory/:inventoryId/create-asset', component: () => import('pages/CreateAssetPage.vue') },
      { path: '/inventory/:inventoryId/group/:groupId/create-group', component: () => import('pages/CreateGroupPage.vue') },
      { path: '/inventory/:inventoryId/group/:groupId/create-asset', component: () => import('pages/CreateAssetPage.vue') },
      { path: '/inventory/:inventoryId/group/:groupId', component: () => import('pages/GroupPage.vue') },
      { path: '/inventory/:inventoryId/asset/:assetId', component: () => import('pages/AssetPage.vue') }
    ]
    
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
