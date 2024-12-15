import NoSsr from "@/common/NoSsr";
import { ResetPasswordModule } from "@/modules";
import { UserType } from "@/types";

export default function OperatorSetPassword() {
  return (
    <NoSsr>
      <ResetPasswordModule type="set" variant={UserType.Operator} />
    </NoSsr>
  );
}
