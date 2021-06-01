export interface Login {
  username: string;
  password: string;
  client_secret?: string;
  client_id?: any;
  grant_type?: string;
  scope?: string;
}

export interface User {
  name: String;
  surname: string;
  email: String;
  password: string;
  password_confirmation: string;
  national_id: number;
  mobile: number;

}
