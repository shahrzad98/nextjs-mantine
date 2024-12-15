import { LoginModule } from "@/modules";
import { UserType } from "@/types";

export default function LoginOrganizer() {
  return <LoginModule variant={UserType.Organizer} />;
}
