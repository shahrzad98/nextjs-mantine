import { PromoterOnboardingModule } from "@/modules";
import userStore from "@/stores/userStore";
import { IUserStore, UserType } from "@/types";
import { useRouter } from "next/router";

export default function OnboardingAccountSetup() {
  const router = useRouter();
  const currentUser = userStore((state: IUserStore) => state.currentUser);

  if (router.isReady && currentUser?.role !== UserType.Promoter) {
    router.push("/");

    return;
  }

  return router.isReady && <PromoterOnboardingModule />;
}
