import { LoginModule } from "@/modules";
import { UserType } from "@/types";

export default function LoginOperator() {
  return <LoginModule variant={UserType.Operator} />;
}
