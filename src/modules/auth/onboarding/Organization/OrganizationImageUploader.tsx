import { rem, FileButton, Flex, Image, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface IOrganizationImageUploaderProps {
  file: File | string | null;
  onChange: (file: File) => void;
}

export const OrganizationImageUploader = ({ file, onChange }: IOrganizationImageUploaderProps) => (
  <FileButton accept="image/png,image/jpeg" onChange={onChange}>
    {(props) => (
      <Flex
        {...props}
        direction={"column"}
        justify={"center"}
        align={"center"}
        w={"100%"}
        h={!file ? rem(102) : undefined}
        my={rem(11)}
        sx={{
          borderRadius: rem(6),
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='6' ry='6' stroke='%235C5F65' stroke-width='2' stroke-dasharray='6' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`,
        }}
      >
        {file ? (
          <Image
            src={typeof file === "string" ? file : URL.createObjectURL(file)}
            alt="organization-cover"
          />
        ) : (
          <>
            <IconPlus size={rem(34)} />
            <Text mt={rem(2)} fw={300} size={rem(10)}>
              Upload Image
            </Text>
          </>
        )}
      </Flex>
    )}
  </FileButton>
);
