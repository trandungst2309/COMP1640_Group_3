import { useState, useRef } from "react";

export default function Recorder() {
  const [recordings, setRecordings] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.current.push(event.data);
      }
    };
    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordings((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);
      audioChunks.current = [];
    };
    recorder.start();
    setMediaRecorder(recorder);
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {isRecording ? "Stop" : "Start record"}
      </button>
      <ul className="mt-4">
        {recordings.map((rec, index) => (
          <li key={index} className="mt-2">
            <audio controls src={rec.url}></audio>
            <a
              href={rec.url}
              download={`recording-${index + 1}.webm`}
              className="ml-2 text-blue-500"
            >
              Download
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
