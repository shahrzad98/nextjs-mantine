import NoSsr from "@/common/NoSsr";
import { CheckoutModule, NumberVerificationForm } from "@/modules";

export default function CheckoutPhoneVerification() {
  return (
    <NoSsr>
      <CheckoutModule>
        <NumberVerificationForm isCheckout />
      </CheckoutModule>
    </NoSsr>
  );
}
