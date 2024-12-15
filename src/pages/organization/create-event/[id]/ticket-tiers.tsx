import withAuth from "@/common/withAuth";
import { EventTicketTiers } from "@/modules";

function CreateEventTicketTiers() {
  return <EventTicketTiers />;
}

export default withAuth(CreateEventTicketTiers);
