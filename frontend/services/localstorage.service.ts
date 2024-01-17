import type { User } from '~/types/__generated__/resolvers-types';

export class LocalstorageService {
  static getActiveUser(): User | null {
    const user = localStorage.getItem('active-user');

    if (user) {
      return JSON.parse(user);
    }

    return null;
  }

  static setActiveUser(user: User | null): void {
    if (user) {
      localStorage.setItem('active-user', JSON.stringify(user));
    } else {
      localStorage.removeItem('active-user');
    }
  }
}
