interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  role: 'user' | 'admin';
}

class AuthService {
  private currentUser: User | null = null;
  private fakeDelay = 500; // Giả lập độ trễ network

  // Giả lập lưu trữ user trong localStorage
  private persistUser(user: User | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Giả lập lấy user từ localStorage
  private loadPersistedUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  async login(identifier: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, this.fakeDelay));

    // Admin with phone login
    if ((identifier === 'admin@example.com' || identifier === '+84123456789') && password === 'admin123') {
      const user: User = {
        id: '1',
        email: 'admin@example.com',
        phone: '+84123456789',
        name: 'Admin User',
        role: 'admin'
      };
      this.currentUser = user;
      this.persistUser(user);
      return user;
    }

    // Regular user phone login (example)
    if (identifier === '+84987654321' && password === 'user123') {
      const user: User = {
        id: '2',
        phone: '+84987654321',
        name: 'Phone User',
        role: 'user'
      };
      this.currentUser = user;
      this.persistUser(user);
      return user;
    }

    throw new Error('Invalid credentials');
  }

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, this.fakeDelay));
    this.currentUser = null;
    this.persistUser(null);
  }

  async getCurrentUser(): Promise<User | null> {
    // Nếu đã có user trong memory, return luôn
    if (this.currentUser) {
      return this.currentUser;
    }

    // Thử load từ localStorage
    const persistedUser = this.loadPersistedUser();
    if (persistedUser) {
      this.currentUser = persistedUser;
      return persistedUser;
    }

    return null;
  }

  async register(data: { phone: string; password: string; name: string }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, this.fakeDelay));
    
    const newUser: User = {
      id: crypto.randomUUID(),
      phone: data.phone,
      name: data.name,
      role: 'user'
    };

    this.currentUser = newUser;
    this.persistUser(newUser);
    return newUser;
  }
}

export default new AuthService(); 