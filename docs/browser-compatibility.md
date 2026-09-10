# Browser and platform compatibility

Web Speech API synthesis is widely implemented, but the API surface and the underlying voice inventory are not the same thing.

Applications should test:

- whether `window.speechSynthesis` exists;
- when the voice list becomes available;
- which languages are installed or exposed;
- whether a selected voice is local or associated with a remote service;
- the behavior of pause/resume/cancel;
- the availability and reliability of `boundary` events;
- behavior on the target mobile and desktop operating systems.

A page should avoid assuming that a voice name, language, event timing, or speech service is identical across environments.
