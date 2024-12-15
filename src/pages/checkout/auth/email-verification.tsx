import NoSsr from "@/common/NoSsr";
import { CheckoutModule, EmailVerificationForm } from "@/modules";

export default function CheckoutEmailVerification() {
  return (
    <NoSsr>
      <CheckoutModule>
        <EmailVerificationForm />
      </CheckoutModule>
    </NoSsr>
  );
}
