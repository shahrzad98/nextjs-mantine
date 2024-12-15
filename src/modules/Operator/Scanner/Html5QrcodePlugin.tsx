import { Html5QrcodeScanner, QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useEffect } from "react";

interface Html5QrcodePluginProps {
  elementId: string;
  config: Html5QrcodeScannerConfig | undefined;
  verbose?: boolean | undefined;
  qrCodeSuccessCallback: QrcodeSuccessCallback;
  qrCodeErrorCallback?: QrcodeErrorCallback | undefined;
}

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props: Html5QrcodeScannerConfig) => {
  const config: any = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }

  return config;
};

const Html5QrcodePlugin = (props: Html5QrcodePluginProps) => {
  useEffect(() => {
    const config = createConfig(props.config as Html5QrcodeScannerConfig);
    const verbose = props.verbose === true;
    config.rememberLastUsedCamera = false;

    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(props.elementId, config, verbose);
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, []);

  return <div id={props.elementId} />;
};

export default Html5QrcodePlugin;
