import { LoginModule } from "@/modules";
import { UserType } from "@/types";

export default function Login() {
  return <LoginModule variant={UserType.Attendee} />;
}
