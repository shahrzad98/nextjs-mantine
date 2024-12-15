export function createWebsocketConnection(
  payload: { [key: string]: string | number },
  callback: (message: { [key: string]: string | number }) => void
) {
  const webSocketUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:3000/cable";
  const socket = new WebSocket(webSocketUrl);

  socket.onopen = function () {
    const msg = {
      command: "subscribe",
      identifier: JSON.stringify(payload),
    };
    socket.send(JSON.stringify(msg));
  };

  socket.onmessage = function (event) {
    const response = event.data;
    const msg = JSON.parse(response);

    if (msg.type === "ping") {
      return;
    }

    if (msg.message) {
      callback(msg.message);
    }
  };

  socket.onerror = function (error) {
    console.log(`WebSocket Error: ${error}`);
  };
}
