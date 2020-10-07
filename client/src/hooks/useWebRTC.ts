import Peer from "peerjs";
import { useState, useEffect, useMemo } from "react";

const STUN_URL = "stun:stun1.l.google.com:19302";

type HookReturn = {
  id: string;
  loading: boolean;
  error?: string;
};

export default function useWebRTC(): HookReturn {
  const [state, setId] = useState<HookReturn>({
    id: null,
    loading: true,
  });

  const { id, loading, error } = state;

  const peer = useMemo(
    () =>
      new Peer({
        config: {
          iceServers: [{ urls: STUN_URL }],
        },
      }),
    []
  );

  useEffect(() => {
    peer.on("open", (newId) => {
      setId({ id: newId, loading: false });
    });

    peer.on("error", (err) => setId({ ...state, loading: false, error: err }));

    return () => {
      peer.destroy();
    };
  }, []);

  return { id, loading, error };
}
