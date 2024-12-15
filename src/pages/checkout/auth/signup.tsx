import NoSsr from "@/common/NoSsr";
import { CheckoutModule, SignupForm } from "@/modules";

export default function CheckoutSignup() {
  return (
    <NoSsr>
      <CheckoutModule>
        <SignupForm isCheckout />
      </CheckoutModule>
    </NoSsr>
  );
}
