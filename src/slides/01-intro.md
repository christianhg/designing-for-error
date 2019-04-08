# Designing for Error

---

Idea

---

Different way of structuring code

---

Mindset

---

Making it harder to choose the happy path

---

`oembed: https://vimeo.com/97344498`

`oembed: https://www.youtube.com/watch?v=mzidu-5iVRk`

---

```ts
import { DialogService } from '...';
import { GettextCatalog } from '...;

// ...

constructor(
    @Inject('gettextCatalog') private gettextCatalog: GettextCatalog,
private dialogService: DialogService
) {}

// ...

getSomething(...)
     .then(...)
     .catch(() => {
         this.dialogService.showErrorDialog(this.gettextCatalog.getString('My error message'))
     })
```

---

```
CCIEFL-9651: Create centralised service to handle error messages

The purpose is to have a single place to gather error messages.

Some benefits:

- Errors are no longer magic strings.
- It makes it easier to standardise our error messages and make them consistent.
- It makes it easier to see where each error can occur.
- It allows you to produce a translatable error state outside of the
  Angular(JS) context (since a free function could return
  `SomeData | CueError.SomeError`.)
- We get better at thinking about errors up-front (since they can be defined
  up-front.)
- It allows you to not worry about making typos (since you don't have to type
  out error messages that often.)
- It allows you to not worry about duplicating an error message.
- It helps you remember to make the error message translatable.

Some downsides:

- It can be hard to come up with a good name for an error (to use in the
    `CueError` enum.)
- I haven't found a nice way to pass "extra data" to show an interpolated error
    message.
```

---

```typescript
export enum CueError {
  DropError,
  WorkflowErrorRequiredField,
  WorkflowErrorInsufficientRights,
  WorkflowErrorForeignLock,
}
```

---

# Gatsby Deck

Create presentations using Gatsby & React.

---

> Inscrutable icons litter the face of the devices even though the research
> community has long demonstrated that people cannot remember the meaning of
> more than a small number of icons […] Who can remember what each icon
> means? Not me.
> <cite>Don Norman</cite>

---

# 🤫

---

## Slides are written in Markdown!

Here's the source of the first slide:

    # Gatsby Deck

    Create presentations using Gatsby & React.
