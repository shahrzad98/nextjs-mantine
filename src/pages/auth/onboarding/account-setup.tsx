import { OnboardingAttendeeModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore } from "@/types";
import { useRouter } from "next/router";

export default function SignupStep2() {
  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  if (currentUser?.data?.role) {
    router.push("/");

    return;
  }

  return <OnboardingAttendeeModule />;
}
