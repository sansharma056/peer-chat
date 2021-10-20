import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import DocumentTitle from "react-document-title";
import Button from "./Button";

type RoomParams = {
	id: string;
};

const Room = () => {
	const { id } = useParams<RoomParams>();
	const videoRef = useRef<HTMLVideoElement>(null);

	async function startCapture(): Promise<MediaStream | null> {
		let captureStream: MediaStream | null = null;

		try {
			captureStream = await navigator.mediaDevices.getDisplayMedia();
		} catch (error) {
			console.error(error);
		}

		return captureStream;
	}

	async function handleScreenShare() {
		console.log("screen shared");

		const captureStream = await startCapture();

		if (videoRef.current) {
			videoRef.current.srcObject = captureStream;
			console.log(captureStream);
		}
	}

	function handleMicrophoneShare() {
		console.log("microphone shared");
	}

	return (
		<DocumentTitle title="PeerChat - Room">
			<div className="p-2.5 min-h-screen flex flex-col items-center">
				<div className="h-2/3 w-11/12 flex flex-col mt-10 justify-around">
					<h1 className="w-max">room id: {id}</h1>

					<Link className="w-max hover:underline block" to="/">
						Go back
					</Link>

					<div className="flex mt-2 justify-around">
						<Button value="toggle share screen" onClick={handleScreenShare} />
						<Button value="toggle microphone" onClick={handleMicrophoneShare} />
					</div>
				</div>

				<div className="flex flex-grow justify-center mt-10 bg-gray-100 w-11/12">
					<video className="w-4/5" ref={videoRef}></video>
				</div>
			</div>
		</DocumentTitle>
	);
};

export default Room;
