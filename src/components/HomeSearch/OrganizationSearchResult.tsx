import { ISearchOrganization } from "@/types";
import { Avatar, Flex, Text } from "@mantine/core";
import { useRouter } from "next/router";
import { FC } from "react";

interface IOrganizationSearchResultProps {
  organization: ISearchOrganization;
}

const OrganizationSearchResult: FC<IOrganizationSearchResultProps> = ({ organization }) => {
  const router = useRouter();

  return (
    <>
      <Flex
        onClick={() => router.push(`/marketplace/${organization.slug}`)}
        sx={{
          width: 328,
          height: 64,
          padding: 15,
          borderRadius: 4,
          backgroundColor: "#25262B",
          "& img": { borderRadius: 100 },
          border: "1px solid #373A3F",
          cursor: "pointer",
        }}
        align="center"
      >
        <Avatar
          src={organization.cover_photo ?? ""}
          alt={organization.name ?? ""}
          size={48}
          sx={{ "& svg": { width: "100%", height: "100%" } }}
        />
        <Text color="#FFFFFFB2" ml={9}>
          {organization.name}
        </Text>
      </Flex>
    </>
  );
};

export default OrganizationSearchResult;
