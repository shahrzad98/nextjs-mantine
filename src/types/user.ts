export enum UserType {
  Guest = "guest",
  Attendee = "attendee",
  Organizer = "organizer",
  Operator = "operator",
  Admin = "admin",
  Promoter = "promoter",
}

export interface IDefaultRequest {
  message?: string;
  errors?: string[];
}
export interface ICurrentUserStorage {
  state: {
    currentUser: ICurrentUser;
  };
}

export interface IGuestToken {
  id: string;
  ip: string;
  current_access_token: { name: string; token: string; expires_at: string };
}

export interface ICurrentUser {
  data?: Partial<IAttendee & IOrganizationUser & IAdminUser & IPromoterUser>;
  role: UserType;
  token: string;
  expiry: number;
  refreshToken?: string;
  apiTokenExpiry?: string;
}

export interface IUserStore {
  currentUser: ICurrentUser | null;
  setUser: (user: ICurrentUser) => void;
  logout: () => void;
  isAuth: () => boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: (collapsed: boolean) => void;
}

export interface IUserLoginRequest {
  user: {
    email: string;
    password: string;
  };
}

export interface IEmailConfirmationResponse {
  email_confirmed_at: string;
}

export interface ISSORequest {
  state: string;
  code: string;
  scope: string;
  authuser: string;
  hd: string;
  prompt: string;
  return_to: "checkout" | "mytickets" | "false";
  cart_token?: string;
}

export interface IAttendee {
  id: string;
  email: string;
  mobile: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  country: string;
  city: string;
  address: string;
  email_confirmed_at: string;
  mobile_confirmed_at: string;
  lat?: number | null;
  lng?: number | null;
  province_state: string;
  zip_pc?: string | null;
  customer_id: string;
  current_access_token: {
    name: string;
    token: string;
    abilities: string;
    expires_at: string;
    refresh_token: string;
    refresh_token_expires_at: string;
  };
}

export interface IOrganizerAccountRequest {
  first_name: string;
  last_name: string;
}

export interface IPromoterAccountRequest {
  first_name: string;
  last_name: string;
  username: string;
}

export interface IAttendeeAccountRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  date_of_birth?: string;
  country?: string;
  city?: string;
  address?: string;
  zip_pc?: string | null;
  lat?: number | null;
  lng?: number | null;
  customer_id?: string;
}

export interface IOrganizationUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  current_access_token: {
    name: string;
    token: string;
    abilities: string;
    expires_at: string;
    refresh_token: string;
    refresh_token_expires_at: string;
  };
  organization: IOrganizatonSettings;
}

export interface IOrganizatonSettings {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  city: string;
  zip_pc: string;
  province_state: string;
  address: string;
  cover_photo: File | string | null;
  stripe_account_id: string;
  active: boolean;
  balance: string;
  created_at: string;
  updated_at: string;
  lat: number;
  lng: number;
}

export interface IAdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  current_access_token: {
    name: string;
    token: string;
    abilities: string;
    expires_at: string;
    refresh_token: string;
    refresh_token_expires_at: string;
  };
}

export interface IPromoterUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  active: boolean;
  current_access_token: {
    name: string;
    token: string;
    refresh_token: string;
    abilities: string;
    expires_at: string;
    refresh_token_expires_at: string;
  };
}

export interface IUserSignInRequest {
  email: string;
  password: string;
  remember?: boolean;
  cart_token?: string | null;
}

export interface IUserRefreshTokenRequest {
  access_token: string;
  refresh_token: string;
  variant: "attendee" | "organization";
}

export interface IUserSignInResponse extends IDefaultRequest {
  data: IAttendee | IOrganizationUser;
}

export interface IUserSignupRequest {
  email: string;
  password: string;
  password_confirmation: string;
  cart_token?: string | null;
}

export interface IOrganizerSetPasswordRequest {
  new_password: string;
  reset_password_token: string;
}

export interface IAtttendeeAccountSetupRequest {
  first_name: string;
  last_name: string;
  mobile: string;
}

export interface IUserSignupResponse extends IDefaultRequest {
  data: {
    access_token: string;
  };
}

export interface ILogoutResponse {
  message: string;
}

export interface IAttendeeStripeResponse {
  url: string;
}
