import { useState, type ChangeEvent, type FormEvent } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LabeledInput } from "../components/ui/LabeledInput";
import { useUploadMeeting } from "../hooks/useMeetings";
import { getErrorMessage } from "../utils/error";

export function UploadPage() {
  const navigate = useNavigate();
  const uploadMeeting = useUploadMeeting();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!file) {
      setError("Choose a recording file first");
      return;
    }

    setError("");
    setStatus("");

    try {
      const response = await uploadMeeting.mutateAsync({ title: title || file.name, file });
      setStatus(`Upload accepted. Meeting ${response.meetingId} is ${response.status}.`);
      window.setTimeout(() => navigate(`/meetings/${response.meetingId}`), 900);
    } catch (caught) {
      setError(getErrorMessage(caught, "Upload failed"));
    }
  }

  return (
    <section className="rounded-md border border-stone-200 bg-white p-5">
      <div className="mb-5 flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-md bg-moss/10 text-moss">
          <Upload size={20} />
        </div>
        <div>
          <h2 className="font-semibold">Upload recording</h2>
          <p className="text-sm text-stone-500">mp3, wav, m4a, and mp4 files are supported.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-4">
        <LabeledInput label="Meeting title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Payments sync" />
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-stone-700">Recording</span>
          <input
            className="focus-ring block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
            type="file"
            accept=".mp3,.wav,.m4a,.mp4,audio/*,video/mp4"
            onChange={(event: ChangeEvent<HTMLInputElement>) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>

        {error && <p className="rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
        {status && <p className="rounded-md border border-moss/20 bg-moss/10 px-3 py-2 text-sm text-moss">{status}</p>}

        <button
          className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md bg-moss px-4 font-medium text-white hover:bg-[#1f5c4f]"
          disabled={uploadMeeting.isPending}
        >
          <Upload size={18} />
          {uploadMeeting.isPending ? "Uploading..." : "Upload and process"}
        </button>
      </form>
    </section>
  );
}
