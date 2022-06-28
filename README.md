# Start development

## MacOS

Run once:

```
./initenv.bash
```

Run this at start of terminal:

```
source ./devenv.bash
```

# Store configuration

```
import { AppStore } from "./simple-redux";
import * as Redux from "@reduxjs/toolkit";
import { RootAppState } from "./states/RootAppState";

function rootReducer(state: RootAppState | undefined, action: Redux.AnyAction) {
  return state ?? new RootAppState({});
}

export const reduxStore = Redux.configureStore({
  preloadedState: new RootAppState({}),
  reducer: AppStore.wrapReducer(rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const appStore = new AppStore<RootAppState>({
  reduxStore: reduxStore,
});
```

# AppState Example

# AppEvent Example

# Dispatch Event
