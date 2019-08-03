const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  username: state => state.user.username,
  roles: state => state.user.roles,
  menus: state => state.user.menus,
  status: state => state.user.status,
  loginStatus: state => state.user.loginStatus,
  isLock: state => state.user.isLock,
  lockPasswd: state => state.user.lockPasswd,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routes: state => state.permission.routes
}
export default getters
