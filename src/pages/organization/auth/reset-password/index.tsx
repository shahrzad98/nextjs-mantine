import NoSsr from "@/common/NoSsr";
import { ResetPasswordModule } from "@/modules";
import { UserType } from "@/types";

export default function OrganizerResetPassword() {
  return (
    <NoSsr>
      <ResetPasswordModule type="reset" variant={UserType.Organizer} />
    </NoSsr>
  );
}
