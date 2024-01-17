export enum RouteName {
  Login = 'Login',
  Logout = 'Logout',
  Users = 'Users',
  Travels = 'Travels',
  Tours = 'Tours',
}

export const ROUTES: Record<RouteName, string> = {
  [RouteName.Login]: '/login',
  [RouteName.Logout]: '/logout',
  [RouteName.Tours]: '/tours',
  [RouteName.Travels]: '/travels',
  [RouteName.Users]: '/users',
};
