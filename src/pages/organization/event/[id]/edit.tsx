import { getEvent } from "@/api/handler";
import withAuth from "@/common/withAuth";
import { EventDetailsForm } from "@/modules";
import { eventKey } from "@/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";

function EditEvent() {
  const queryClient = useQueryClient();

  const {
    query: { id },
  } = useRouter();

  const { data: eventData } = useQuery(
    [eventKey(id as string)],
    () => getEvent(id as string).then((res) => res.data),
    {
      initialData: queryClient.getQueryData([eventKey(id as string)]),
      enabled: !!id,
    }
  );

  return <EventDetailsForm variant="edit" status={eventData?.status} />;
}

export default withAuth(EditEvent);
