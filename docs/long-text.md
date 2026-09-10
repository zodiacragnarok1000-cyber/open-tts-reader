# Long-text TTS and utterance chunking

A document reader should not treat an entire book or article as one `SpeechSynthesisUtterance`.

## Why chunking is useful

Chunking makes it easier to:

- track progress;
- associate events with a bounded portion of the source document;
- recover from an individual utterance error;
- maintain a predictable application queue;
- implement pause/resume/stop controls;
- avoid depending on undocumented behavior for very large utterances.

A practical pipeline is:

```text
Document
  ↓
paragraphs
  ↓
sentences
  ↓
bounded chunks
  ↓
SpeechSynthesisUtterance
  ↓
SpeechSynthesis queue
```

## Chunk boundaries

Good boundaries are normally paragraph and sentence boundaries. Arbitrary character slicing can produce unnatural pauses and can separate punctuation from the text it belongs to.

A reader should also preserve enough source-position metadata to map an utterance back to the original document. This is useful for progress indicators and future text highlighting.

## Queue strategy

`SpeechSynthesis.speak()` adds an utterance to the synthesis queue. A reader can therefore enqueue a controlled sequence, but should avoid creating an unbounded queue for a very large document. Keeping application-level chunks and queue state explicit makes cancellation and recovery easier.

The exact maximum useful utterance size is implementation-dependent; applications should test their target browser/OS combinations rather than treating a single numeric limit as a universal browser rule.
