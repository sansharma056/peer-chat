import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import DocumentTitle from "react-document-title";
import Button from "./Button";
import { Socket } from "socket.io-client";

type RoomProps = {
	socket: Socket;
};

type RoomParams = {
	id: string;
};

type Message =
	| {
			type: "video-offer" | "video-answer";
			sdp: RTCSessionDescriptionInit;
	  }
	| {
			type: "new-ice-candidate";
			candidate: RTCIceCandidateInit;
	  }
	| {
			type: "stream-info";
			id: string;
			content: "screen" | "audio";
	  };

const Room = ({ socket }: RoomProps) => {
	const { id } = useParams<RoomParams>();

	const videoLocalRef = useRef<HTMLVideoElement>(null);
	const videoRemoteRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const peerConnection = useRef<RTCPeerConnection | null>(null);
	const [isScreenShared, setScreenShared] = useState(false);
	const [isMicrophoneShared, setMicrophoneShared] = useState(false);
	const [streamInfo] = useState(new Map<string, string>());

	async function handleVideoAnswerMsg(sdp: RTCSessionDescriptionInit) {
		await peerConnection.current
			?.setRemoteDescription(new RTCSessionDescription(sdp))
			.catch(console.error);
	}

	function handleVideoOfferMsg(sdp: RTCSessionDescriptionInit) {
		peerConnection.current
			?.setRemoteDescription(new RTCSessionDescription(sdp))
			.then(() => peerConnection.current?.createAnswer())
			.then((answer) => peerConnection.current?.setLocalDescription(answer))
			.then(() =>
				socket.emit("msg:post", {
					type: "video-answer",
					sdp: peerConnection.current?.localDescription,
				})
			);
	}

	async function handleNewICECandidateMsg(candidate: RTCIceCandidateInit) {
		try {
			await peerConnection.current?.addIceCandidate(
				new RTCIceCandidate(candidate)
			);
		} catch (error) {
			console.error(error, candidate);
		}
	}

	function handleICECandidateEvent(event: RTCPeerConnectionIceEvent) {
		if (event.candidate) {
			socket.emit("msg:post", {
				type: "new-ice-candidate",
				candidate: event.candidate,
			});
		}
	}

	function handleTrackEvent(event: RTCTrackEvent) {
		const stream = event.streams[0];
		let resourceRef: HTMLMediaElement | null = null;

		if (streamInfo.get(stream.id) == "screen") {
			resourceRef = videoRemoteRef.current;
		} else if (streamInfo.get(stream.id) == "audio") {
			resourceRef = audioRef.current;
		}

		if (resourceRef) {
			resourceRef.srcObject = event.streams[0];
		}
	}

	function handleNegotiationNeededEvent() {
		peerConnection.current
			?.createOffer()
			.then((offer) => peerConnection.current?.setLocalDescription(offer))
			.then(() => {
				socket.emit("msg:post", {
					type: "video-offer",
					sdp: peerConnection.current?.localDescription,
				});
			})
			.catch(console.error);
	}

	function createPeerConnection() {
		if (peerConnection.current) {
			return;
		}

		peerConnection.current = new RTCPeerConnection({
			iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
		});
		peerConnection.current.ontrack = handleTrackEvent;
		peerConnection.current.onicecandidate = handleICECandidateEvent;
		peerConnection.current.onnegotiationneeded = handleNegotiationNeededEvent;
	}

	function destroyPeerConnection() {
		if (peerConnection.current) {
			peerConnection.current.ontrack = null;
			peerConnection.current.onicecandidate = null;
			peerConnection.current.onnegotiationneeded = null;

			peerConnection.current
				.getTransceivers()
				.forEach((transreceiver) => transreceiver.stop());

			peerConnection.current.close();
			peerConnection.current = null;
		}
	}

	function handleLeaveRoom() {
		stopResourceShare(videoLocalRef);
		stopResourceShare(videoRemoteRef);
		stopResourceShare(audioRef);
		history.back();
	}

	function stopResourceShare(
		resourceLocalRef: React.RefObject<HTMLMediaElement>
	) {
		if (resourceLocalRef.current && resourceLocalRef.current.srcObject) {
			const stream = resourceLocalRef.current.srcObject as MediaStream;
			if (stream) {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
				resourceLocalRef.current.srcObject = null;
			}
		}
	}

	async function handleScreenShare() {
		if (isScreenShared) {
			stopResourceShare(videoLocalRef);
		} else {
			try {
				if (peerConnection.current != null) {
					if (videoLocalRef.current) {
						const stream = await navigator.mediaDevices.getDisplayMedia();

						socket.emit("msg:post", {
							type: "stream-info",
							id: stream.id,
							content: "screen",
						});

						videoLocalRef.current.srcObject = stream;
						stream
							.getTracks()
							.forEach((track) =>
								peerConnection.current?.addTrack(track, stream)
							);
					}
				}
			} catch (error) {
				console.error(error);
				destroyPeerConnection();
			}
		}

		setScreenShared(!isScreenShared);
	}

	async function handleMicrophoneShare() {
		if (isMicrophoneShared) {
			stopResourceShare(audioRef);
		} else {
			try {
				if (audioRef.current) {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: false,
						audio: true,
					});

					socket.emit("msg:post", {
						type: "stream-info",
						id: stream.id,
						content: "audio",
					});
					stream
						.getTracks()
						.forEach((track) =>
							peerConnection.current?.addTrack(track, stream)
						);
				}
			} catch (error) {
				console.error(error);
				destroyPeerConnection();
			}
		}
		setMicrophoneShared(!isMicrophoneShared);
	}

	useEffect(() => {
		socket.emit("room:join", id);
		createPeerConnection();

		socket.on("msg:get", (msg: Message) => {
			switch (msg.type) {
				case "stream-info":
					streamInfo.set(msg.id, msg.content);
					break;
				case "video-answer":
					handleVideoAnswerMsg(msg.sdp);
					break;
				case "video-offer":
					handleVideoOfferMsg(msg.sdp);
					break;
				case "new-ice-candidate":
					handleNewICECandidateMsg(msg.candidate);
					break;
			}
		});

		return () => destroyPeerConnection();
	}, []);

	return (
		<DocumentTitle title="PeerChat - Room">
			<div className="p-2.5 min-h-screen flex flex-col items-center">
				<div className="h-2/3 w-11/12 flex flex-col mt-10 justify-around">
					<h1 className="w-max">room id: {id}</h1>

					<Button value="leave room" onClick={handleLeaveRoom} />

					<div className="flex mt-2 justify-around">
						<Button value="toggle share screen" onClick={handleScreenShare} />
						<Button value="toggle microphone" onClick={handleMicrophoneShare} />
					</div>
				</div>

				<div className="flex flex-grow justify-center mt-10 bg-gray-100 w-11/12">
					<video
						autoPlay
						id="local"
						className="w-auto"
						ref={videoLocalRef}
						hidden
					></video>
					<video
						autoPlay
						id="remote"
						className="w-auto"
						ref={videoRemoteRef}
					></video>
					<audio autoPlay id="remote" className="hidden" ref={audioRef}></audio>
				</div>
			</div>
		</DocumentTitle>
	);
};

export default Room;
