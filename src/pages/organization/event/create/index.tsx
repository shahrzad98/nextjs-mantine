import withAuth from "@/common/withAuth";
import { EventDetailsForm } from "@/modules";

function CreateEvent() {
  return <EventDetailsForm variant="create" />;
}

export default withAuth(CreateEvent);
