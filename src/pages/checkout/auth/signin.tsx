import NoSsr from "@/common/NoSsr";
import { CheckoutModule, LoginForm } from "@/modules";
import { UserType } from "@/types";

export default function CheckoutSignin() {
  return (
    <NoSsr>
      <CheckoutModule>
        <LoginForm variant={UserType.Attendee} isCheckout />
      </CheckoutModule>
    </NoSsr>
  );
}
