import { Divider, rem, Input, FileButton, Flex, Text } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { ReactNode } from "react";

import { AppImage } from "@/components";

interface IEventImageUploaderProps {
  file: File | string | null;
  onChange: (file: File) => void;
  error: ReactNode;
}

export const EventImageUploader = ({ file, onChange, error }: IEventImageUploaderProps) => (
  <>
    <Divider mb={rem(31)} label="Event Image" labelProps={{ size: "14px", color: "#FFF" }} />
    <Input.Wrapper withAsterisk label={"Upload Primary Event Image"} error={error}>
      <FileButton onChange={onChange} accept="image/png,image/jpeg">
        {(buttonProps) => (
          <Flex
            {...buttonProps}
            direction={"column"}
            justify={"center"}
            align={"center"}
            w={"100%"}
            my={rem(5)}
            pos="relative"
            h={rem(145)}
            sx={{
              border: "1px solid #373A3F",
              borderRadius: rem(16),
              cursor: "pointer",
              img: { objectFit: "cover", borderRadius: rem(16) },
            }}
            bg={"#25262b"}
          >
            {file ? (
              <AppImage
                src={typeof file === "string" ? file : URL.createObjectURL(file)}
                fill
                alt="event-cover"
              />
            ) : (
              <>
                <IconPhoto size={rem(22)} />
                <Text
                  fw={400}
                  size={rem(10)}
                  lh={rem(22)}
                  mt={rem(3)}
                  c="rgba(255, 255, 255, 0.70)"
                >
                  Select to upload an image.
                </Text>
              </>
            )}
          </Flex>
        )}
      </FileButton>
    </Input.Wrapper>
  </>
);
