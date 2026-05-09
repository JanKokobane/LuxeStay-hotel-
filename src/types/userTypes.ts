// export interface UpdateProfileData {
//     country: string | number | readonly string[] | undefined;
//     preferences: any;
//     firstname: string;
//     lastname: string;
//     email: string;
//     contact: string;
//     password?: string;
//   }

export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  address?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  dateofbirth?: string;
  nationality?: string;
  passportnumber?: string;
  preferences?: {
    roomtype?: string;
    bedtype?: string;
    smokingpreference?: string;
    floorpreference?: string;
  };
  loyaltystatus?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  membersincedate?: string;
  totalstays?: number;
  totalnights?: number;
  loyaltypoints?: number;
  profilephoto?: string;
  createdat?: string;
  updatedat?: string;
}

export interface UpdateProfileData {
  firstname?: string;
  lastname?: string;
  email?: string;
  contact?: string;
  address?: string;
  city?: string;
  country?: string;
  zipcode?: string;
  dateofbirth?: string;
  nationality?: string;
  passportnumber?: string;
  preferences?: {
    roomtype?: string;
    bedtype?: string;
    smokingpreference?: string;
    floorpreference?: string;
  };
  password?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  loading: boolean;
}
