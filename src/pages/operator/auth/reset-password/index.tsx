import NoSsr from "@/common/NoSsr";
import { ResetPasswordModule } from "@/modules";
import { UserType } from "@/types";

export default function OperatorResetPassword() {
  return (
    <NoSsr>
      <ResetPasswordModule type="reset" variant={UserType.Operator} />
    </NoSsr>
  );
}
