import NoSsr from "@/common/NoSsr";
import { ResetPasswordModule } from "@/modules";
import { UserType } from "@/types";

export default function OrganizerSetPassword() {
  return (
    <NoSsr>
      <ResetPasswordModule type="set" variant={UserType.Organizer} />
    </NoSsr>
  );
}
