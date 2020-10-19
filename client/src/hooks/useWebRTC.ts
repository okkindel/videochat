import { useState, useEffect, useMemo, useCallback } from "react";
import Peer from "peerjs";

const STUN_URLS = [
  "stun:stun.l.google.com:19302",
  "stun:stun1.l.google.com:19302",
  "stun:stun2.l.google.com:19302",
  "stun:stun3.l.google.com:19302",
  "stun:stun4.l.google.com:19302",
];

type HookReturn = {
  error?: string;
  id: string;
  loading: boolean;
  connectTo: (id: string) => Promise<Peer.MediaConnection>;
};

function getStream() {
  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}

function getOrCreateVideoWithID(id: string): HTMLVideoElement {
  const found = document.getElementById(id) as HTMLVideoElement;
  if (found) {
    return found;
  }

  const video = document.createElement("video");
  video.id = id;
  video.autoplay = true;
  video.style.border = "1px solid black";
  video.style.position = "fixed";
  video.style.top = "0";
  video.style.bottom = "0";
  video.style.left = "0";
  video.style.right = "0";
  video.style.width = "100%";
  video.style.overflow = "auto";
  video.style.zIndex = "1";
  document.body.appendChild(video);

  return video;
}

function attachStreamToVideo(stream: MediaStream) {
  const video = getOrCreateVideoWithID("caller");
  try {
    video.srcObject = stream;
  } catch (error) {
    video.src = window.URL.createObjectURL(stream);
  }
}

export default function useWebRTC(
  roomId: string,
  onCall: () => void
): HookReturn {
  const [state, setState] = useState<
    Pick<HookReturn, "id" | "loading" | "error">
  >({
    id: null,
    loading: true,
  });

  const { id, loading, error } = state;

  const peer = useMemo(
    () =>
      new Peer(roomId, {
        config: {
          iceServers: [{ urls: STUN_URLS }],
        },
        host: "textless.ml",
        port: 9443,
        path: "/textless",
        secure: true,
      }),
    []
  );

  console.log(peer);

  const connectTo = useCallback(
    (destId: string) =>
      getStream().then((stream) => {
        const call = peer.call(destId, stream);
        call.on("stream", (remoteStream) => {
          attachStreamToVideo(remoteStream);
        });
        return call;
      }),
    []
  );

  useEffect(() => {
    peer.on("open", (newId) => {
      setState({ ...state, id: newId, loading: false });
      console.log("open", newId);
    });

    peer.on("error", (err) => {
      setState({ ...state, loading: false, error: err.message });
      console.error(err);
    });

    peer.on("call", async (call: Peer.MediaConnection) => {
      console.log("call", call);
      const stream = await getStream();

      onCall();
      call.answer(stream);

      call.on("stream", (remoteStream) => {
        attachStreamToVideo(remoteStream);
        console.log("onStream", remoteStream);
      });
    });

    return () => {
      peer.destroy();
    };
  }, []);

  return { id, loading, error, connectTo };
}
