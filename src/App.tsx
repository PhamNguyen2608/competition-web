import { Provider } from 'react-redux';
import { store,persistor } from './store';
import RouterProviderWrapper from './router-provider';
import { PersistGate } from 'redux-persist/integration/react'
import { Spinner } from './components/ui/spinner'

function App() {
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <div className="flex items-center justify-center h-screen">
            <Spinner size="xl" />
          </div>
        } 
        persistor={persistor}
      >
        <RouterProviderWrapper />
      </PersistGate>
    </Provider>
  );
}

export default App;
