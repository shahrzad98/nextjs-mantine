import emojiesData from "@emoji-mart/data";
import EmojiPicker from "@emoji-mart/react";
import { Popover, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RichTextEditor as MantineRichTextEditor, Link } from "@mantine/tiptap";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "next/image";
import { useEffect, useState } from "react";

import BoldSvg from "./assets/bold-icon.svg";
import EmojiSvg from "./assets/emoji-icon.svg";
import ItalicSvg from "./assets/italic-icon.svg";
import OrderedListSvg from "./assets/ordered-list-icon.svg";
import StrikeThroughSvg from "./assets/strike-through-icon.svg";
import UnderlineSvg from "./assets/underline-icon.svg";
import UnorderedListSvg from "./assets/unordered-list-icon.svg";
import VideoSvg from "./assets/video-icon.svg";
import { YoutubeModal } from "./YoutubeModal";

const BoldIcon = () => <Image src={BoldSvg} alt="Bold" />;
const ItalicIcon = () => <Image src={ItalicSvg} alt="Italic" />;
const OrderedListIcon = () => <Image src={OrderedListSvg} alt="Ordered List" />;
const StrikeThroughIcon = () => <Image src={StrikeThroughSvg} alt="Strikethrough" />;
const UnderlineIcon = () => <Image src={UnderlineSvg} alt="Underline" />;
const UnorderedListIcon = () => <Image src={UnorderedListSvg} alt="Italic" />;

interface IRichTextEditorProps {
  value: string;
  setValue: (text: string) => void;
  limit?: number;
}

export const RichTextEditor = ({ value, setValue, limit, ...props }: IRichTextEditorProps) => {
  const [emojiPopover, setEmojiPopover] = useState(false);

  const [youtubeVideoOpened, { close: youtubeVideoClose, open: youtubeVideoOpen }] =
    useDisclosure(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      CharacterCount.configure({
        limit,
      }),
      Youtube,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    onUpdate: (e) => {
      setValue(e.editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor?.getHTML() !== value) {
      editor?.commands.setContent(value);
    }
  }, [value]);

  const handleEmojiClick = ({ native: emoji }: { native: string }) => {
    editor?.commands.insertContent(emoji);
    setEmojiPopover(false);
  };

  const handleClickVideo = () => {
    youtubeVideoOpen();
  };

  const handleSubmitVideo = (src: string) => {
    editor?.commands.setYoutubeVideo({
      src,
    });
    editor?.chain().focus().run();
  };

  return (
    <>
      <MantineRichTextEditor
        editor={editor}
        styles={{
          toolbar: {
            backgroundColor: "#25262B",
            padding: "4px 22px",
          },
          control: {
            border: 0,
            marginRight: 8,
            svg: {
              width: 20,
              height: 20,
            },
          },
          controlsGroup: {
            display: "flex",
            flexWrap: "wrap",
          },
          content: {
            padding: 11,
            backgroundColor: "#25262B",
            "& > div": {
              minHeight: 176,
              padding: "0 !important",
            },
          },
        }}
        {...props}
      >
        <MantineRichTextEditor.Toolbar sticky stickyOffset={60}>
          <MantineRichTextEditor.ControlsGroup>
            <MantineRichTextEditor.Bold icon={BoldIcon} />
            <MantineRichTextEditor.Italic icon={ItalicIcon} />
            <MantineRichTextEditor.Underline icon={UnderlineIcon} />
            <MantineRichTextEditor.Strikethrough icon={StrikeThroughIcon} />
            <MantineRichTextEditor.OrderedList icon={OrderedListIcon} />
            <MantineRichTextEditor.BulletList icon={UnorderedListIcon} />
            <Popover
              position="bottom-start"
              shadow="sm"
              transitionProps={{ transition: "pop" }}
              offset={3}
              withinPortal={true}
              opened={emojiPopover}
              onChange={setEmojiPopover}
            >
              <Popover.Target>
                <MantineRichTextEditor.Control
                  aria-label="Insert emoji"
                  title="Insert emoji"
                  onClick={() => setEmojiPopover(true)}
                >
                  <Image src={EmojiSvg} alt="emoji" />
                </MantineRichTextEditor.Control>
              </Popover.Target>
              <Popover.Dropdown
                sx={(theme) => ({
                  padding: 0,
                  "em-emoji-picker": {
                    "--rgb-background": theme.colors.dark[5],
                  },
                })}
              >
                <EmojiPicker data={emojiesData} theme="dark" onEmojiSelect={handleEmojiClick} />
              </Popover.Dropdown>
            </Popover>
            <MantineRichTextEditor.Control
              aria-label="Insert video"
              title="Insert video"
              onClick={handleClickVideo}
            >
              <Image src={VideoSvg} alt="video" />
            </MantineRichTextEditor.Control>
            <MantineRichTextEditor.Link />
            <MantineRichTextEditor.Unlink />
          </MantineRichTextEditor.ControlsGroup>
        </MantineRichTextEditor.Toolbar>
        <MantineRichTextEditor.Content
          sx={{
            iframe: {
              width: "100%",
              height: "auto",
            },
          }}
        />
      </MantineRichTextEditor>
      <YoutubeModal
        opened={youtubeVideoOpened}
        onClose={youtubeVideoClose}
        onModalSubmit={handleSubmitVideo}
      />
      <Text lh={rem(14)} size={rem(10)} mt={2} color="rgba(255, 255, 255, 0.50)">
        {editor?.storage.characterCount.characters()}/{limit} Characters{" "}
      </Text>
    </>
  );
};
