import { OnboardingSetupModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore } from "@/types";
import { useRouter } from "next/router";

export default function OrganizerOnboardingSetup() {
  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);
  if (currentUser?.data?.role === "operator") {
    router.push("/operator");

    return;
  }

  return <OnboardingSetupModule />;
}
