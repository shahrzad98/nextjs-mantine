import { LoginModule } from "@/modules";
import { UserType } from "@/types";

export default function LoginPromoter() {
  return <LoginModule variant={UserType.Promoter} />;
}
