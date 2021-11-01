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

const Room = ({ socket }: RoomProps) => {
	const { id } = useParams<RoomParams>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement>(null);

	const [isScreenShared, setScreenShared] = useState(false);
	const [isMicrophoneShared, setMicrophoneShared] = useState(false);

	function handleLeaveRoom() {
		stopScreenShare();
		stopMicrophoneShare();
		history.back();
	}

	function stopScreenShare() {
		if (videoRef.current && videoRef.current.srcObject) {
			const stream = videoRef.current.srcObject as MediaStream;
			if (stream) {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
				videoRef.current.srcObject = null;
			}
		}
	}

	function stopMicrophoneShare() {
		if (audioRef.current) {
			const stream = audioRef.current.srcObject as MediaStream;
			if (stream) {
				const tracks = stream.getTracks();
				tracks.forEach((track) => track.stop());
				audioRef.current.srcObject = null;
			}
		}
	}

	async function handleScreenShare() {
		if (isScreenShared) {
			stopScreenShare();
		} else {
			try {
				if (videoRef.current) {
					videoRef.current.srcObject =
						await navigator.mediaDevices.getDisplayMedia();
				}
			} catch (error) {
				console.error(error);
			}
		}

		setScreenShared(!isScreenShared);
	}

	async function handleMicrophoneShare() {
		if (isMicrophoneShared) {
			stopMicrophoneShare();
		} else {
			try {
				if (audioRef.current) {
					audioRef.current.srcObject =
						await navigator.mediaDevices.getUserMedia({
							video: false,
							audio: true,
						});
				}
			} catch (error) {
				console.error(error);
			}
		}

		setMicrophoneShared(!isMicrophoneShared);
	}

	useEffect(() => {
		socket.on("connect", () => {
			console.log("connected");
		});

		socket.emit("room:join", id);
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
					<video autoPlay className="w-auto" ref={videoRef}></video>
					<audio autoPlay className="hidden" ref={audioRef}></audio>
				</div>
			</div>
		</DocumentTitle>
	);
};

export default Room;
