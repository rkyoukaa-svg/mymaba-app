const reconnectDelay = 3000;

function getWebSocketUrl() {
  const configuredUrl = import.meta.env.VITE_WS_URL?.trim();

  if (!configuredUrl) {
    return null;
  }

  if (configuredUrl.startsWith('http://')) {
    return configuredUrl.replace('http://', 'ws://');
  }

  if (configuredUrl.startsWith('https://')) {
    return configuredUrl.replace('https://', 'wss://');
  }

  return configuredUrl;
}

export function createRealtimeClient({ onMessage, onStatus, onError } = {}) {
  let socket = null;
  let reconnectTimer = null;
  let manuallyClosed = false;
  let reconnectAttempt = 0;
  const url = getWebSocketUrl();

  const updateStatus = (status) => {
    if (onStatus) {
      onStatus(status);
    }
  };

  const connect = () => {
    if (!url) {
      updateStatus('disabled');
      return;
    }

    if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    manuallyClosed = false;
    updateStatus('connecting');
    socket = new WebSocket(url);

    socket.addEventListener('open', () => {
      reconnectAttempt = 0;
      updateStatus('connected');
    });

    socket.addEventListener('message', (event) => {
      let payload = event.data;

      try {
        payload = JSON.parse(event.data);
      } catch {
        // Keep text messages as-is.
      }

      if (onMessage) {
        onMessage(payload);
      }
    });

    socket.addEventListener('error', (error) => {
      updateStatus('error');
      if (onError) {
        onError(error);
      }
    });

    socket.addEventListener('close', () => {
      socket = null;
      updateStatus('disconnected');

      if (!manuallyClosed) {
        reconnectAttempt += 1;
        reconnectTimer = window.setTimeout(connect, Math.min(reconnectDelay * reconnectAttempt, 15000));
      }
    });
  };

  const send = (message) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return false;
    }

    socket.send(typeof message === 'string' ? message : JSON.stringify(message));
    return true;
  };

  const close = () => {
    manuallyClosed = true;
    if (reconnectTimer) {
      window.clearTimeout(reconnectTimer);
    }
    if (socket) {
      socket.close();
    }
  };

  connect();

  return {
    connect,
    send,
    close,
    getUrl: () => url,
    isEnabled: () => Boolean(url)
  };
}
