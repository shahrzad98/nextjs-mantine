import { Button, Flex, Modal, Text } from "@mantine/core";
import { IconDownload, IconX } from "@tabler/icons-react";
import { useRef } from "react";
import QRCode from "react-qr-code";

interface IDownloadQRCodeProps {
  closeQr: () => void;
  qrOpened: boolean;
  qrURL: string;
}

const DownloadQRCode = ({ closeQr, qrOpened, qrURL }: IDownloadQRCodeProps) => {
  const qrCodeImageRef = useRef(null);

  const downloadQR = () => {
    const svg = document.getElementById("qr_code");
    if (svg && svg.tagName === "svg") {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new window.Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = "qrCode.png";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    }
  };

  return (
    <Modal
      styles={{
        content: { background: "transparent" },
      }}
      opened={qrOpened}
      onClose={closeQr}
      centered
      withCloseButton={false}
    >
      <Flex direction="column" justify="center" w={227} m="auto">
        <Flex justify="end" align="center" mb={12} sx={{ cursor: "pointer" }} onClick={closeQr}>
          <Text size="md" fw={300}>
            Close
          </Text>
          <IconX size={24} />
        </Flex>
        <Flex justify="center" align="center" bg="gray.0" p={10} h={227} w={227}>
          <QRCode
            crossOrigin={"anonymous"}
            size={200}
            value={qrURL}
            id="qr_code"
            ref={qrCodeImageRef}
          />
        </Flex>
        <Button
          onClick={downloadQR}
          w={141}
          h={34}
          mt={36}
          mx="auto"
          sx={{
            background: "var(--Gradient, linear-gradient(45deg, #3077F3 0%, #15AABF 100%))",
          }}
        >
          <IconDownload />
          <Text ml={10} size={15} fw={400}>
            Download
          </Text>
        </Button>
      </Flex>
    </Modal>
  );
};

export default DownloadQRCode;
