import { useState, type FormEvent } from "react";
import { MessageSquareText, Search } from "lucide-react";
import { useAskMeetings } from "../hooks/useMeetings";
import { formatTime } from "../utils/format";
import { getErrorMessage } from "../utils/error";

export function AskPage() {
  const askMeetings = useAskMeetings();
  const [question, setQuestion] = useState("What did John say about payment processing last month?");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    askMeetings.reset();

    try {
      await askMeetings.mutateAsync(question);
    } catch (caught) {
      setError(getErrorMessage(caught, "Question failed"));
    }
  }

  const answer = askMeetings.data?.answer ?? "";
  const sources = askMeetings.data?.sources ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
      <section className="rounded-md border border-stone-200 bg-white p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-coral/10 text-coral">
            <Search size={20} />
          </div>
          <h2 className="font-semibold">Ask across meetings</h2>
        </div>
        <form onSubmit={submit}>
          <textarea
            className="focus-ring min-h-32 w-full resize-y rounded-md border border-stone-300 px-3 py-3 leading-7"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          {error && <p className="mt-3 rounded-md border border-coral/30 bg-coral/10 px-3 py-2 text-sm text-coral">{error}</p>}
          <button className="focus-ring mt-4 inline-flex h-11 items-center gap-2 rounded-md bg-ink px-4 font-medium text-white hover:bg-black" disabled={askMeetings.isPending}>
            <MessageSquareText size={18} />
            {askMeetings.isPending ? "Searching..." : "Ask"}
          </button>
        </form>
        {answer && (
          <div className="mt-6 border-t border-stone-200 pt-5">
            <h3 className="mb-2 font-semibold">Answer</h3>
            <p className="leading-7 text-stone-700">{answer}</p>
          </div>
        )}
      </section>

      <section className="rounded-md border border-stone-200 bg-white p-5">
        <h3 className="font-semibold">Sources</h3>
        {!sources.length && <p className="mt-3 text-sm text-stone-500">Matching source segments will appear here.</p>}
        <div className="mt-4 space-y-3">
          {sources.map((source, index) => (
            <div key={`${source.meetingId}-${index}`} className="border-b border-stone-100 pb-3">
              <p className="font-medium">{source.title}</p>
              {source.segmentStart != null && (
                <p className="mt-1 text-xs text-moss">
                  {formatTime(source.segmentStart)} - {formatTime(source.segmentEnd ?? source.segmentStart)}
                </p>
              )}
              <p className="mt-2 text-sm leading-6 text-stone-600">{source.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
