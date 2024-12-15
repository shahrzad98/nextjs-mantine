import { ResetPasswordModule } from "@/modules";
import { UserType } from "@/types";

export default function ForgotPassword() {
  return <ResetPasswordModule type="reset" variant={UserType.Attendee} />;
}
