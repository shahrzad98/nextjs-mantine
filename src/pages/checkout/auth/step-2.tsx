import NoSsr from "@/common/NoSsr";
import { CheckoutModule, SignupStep2Form } from "@/modules";

export default function CheckoutStep2() {
  return (
    <NoSsr>
      <CheckoutModule>
        <SignupStep2Form isCheckout />
      </CheckoutModule>
    </NoSsr>
  );
}
