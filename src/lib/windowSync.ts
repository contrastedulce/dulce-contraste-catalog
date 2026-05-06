
const CHANNEL_NAME = 'dulce-contraste-sync';

type SyncPayload = {
  type: 'STATE_UPDATE';
  data: any;
  source: string;
} | {
  type: 'REQUEST_STATE';
  source: string;
};

export const createSyncChannel = (onStateReceived: (data: any) => void, onRequestState?: () => void) => {
  const channel = new BroadcastChannel(CHANNEL_NAME);
  const windowId = Math.random().toString(36).substr(2, 9);

  channel.onmessage = (event: MessageEvent<SyncPayload>) => {
    const payload = event.data;
    
    if (payload.type === 'STATE_UPDATE' && payload.source !== windowId) {
      onStateReceived(payload.data);
    } else if (payload.type === 'REQUEST_STATE' && payload.source !== windowId) {
      // If someone requested state, the window that can provide it should broadcast it
      if (onRequestState) onRequestState();
    }
  };

  return {
    broadcastState: (state: any) => {
      channel.postMessage({
        type: 'STATE_UPDATE',
        data: state,
        source: windowId
      });
    },
    requestState: () => {
      channel.postMessage({ 
        type: 'REQUEST_STATE',
        source: windowId
      });
    },
    close: () => channel.close()
  };
};
