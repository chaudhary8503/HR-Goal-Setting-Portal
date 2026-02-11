export interface UserProp {
  email: string;
  name?: string;
  department?: string;
  designation?: string;
  managers_goal?: string;
}


export interface LoginProps {
  onLogin: (user: UserProp) => void;
}