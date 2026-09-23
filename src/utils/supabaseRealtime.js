import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
const channelName = import.meta.env.VITE_SUPABASE_CHANNEL?.trim() || 'mymaba-realtime';

export function createSupabaseRealtimeClient({ onMessage, onStatus, onError } = {}) {
  const enabled = Boolean(supabaseUrl && supabaseAnonKey);
  let channel = null;

  const updateStatus = (status) => {
    if (onStatus) {
      onStatus(status);
    }
  };

  if (!enabled) {
    updateStatus('disabled');

    return {
      send: () => false,
      close: () => undefined,
      getUrl: () => null,
      isEnabled: () => false
    };
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    realtime: { params: { eventsPerSecond: 10 } }
  });

  channel = supabase
    .channel(channelName)
    .on('broadcast', { event: 'mymaba-event' }, ({ payload }) => {
      if (onMessage) {
        onMessage(payload);
      }
    });

  updateStatus('connecting');
  channel.subscribe((status, error) => {
    if (status === 'SUBSCRIBED') {
      updateStatus('connected');
      return;
    }

    if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      updateStatus('error');
      if (onError) {
        onError(error || new Error(`Supabase Realtime status: ${status}`));
      }
      return;
    }

    updateStatus(status.toLowerCase());
  });

  return {
    send: (payload) => {
      if (!channel) {
        return Promise.resolve('closed');
      }

      return channel.send({
        type: 'broadcast',
        event: 'mymaba-event',
        payload
      });
    },
    close: () => {
      if (channel) {
        channel.unsubscribe();
        channel = null;
      }
    },
    getUrl: () => supabaseUrl,
    isEnabled: () => true
  };
}
