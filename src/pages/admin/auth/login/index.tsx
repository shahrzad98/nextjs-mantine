import { LoginModule } from "@/modules";
import { UserType } from "@/types";

export default function LoginAdmin() {
  return <LoginModule variant={UserType.Admin} />;
}
