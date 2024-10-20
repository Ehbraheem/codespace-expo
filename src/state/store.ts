import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import user from './reducers/user.reducer';
import settings from './reducers/settings.reducer';
import users from './reducers/users.reducer';
import logs from './reducers/logs.reducer';
import { persistReducer } from 'redux-persist';
import { combineReducers } from 'redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserApi } from './services/user.service';
import { JobApi } from './services/job.service';
import { NotesApi } from './services/note.service';
import { OrderApi } from './services/order.service';
import { ShipmentApi } from './services/shipment.service';
import { ShippingApi } from './services/shipping.service';
import { StorageApi } from './services/storage.service';
import { SupplierApi } from './services/supplier.service';
import { UsersApi } from './services/users.service';
import { VesselApi } from './services/vessel.service';
import { SecurityApi } from './services/security.service';
import { UtilsApi } from './services/utils.service';

const persistConfig = {
  key: 'root',
  version: 1,
  storage: AsyncStorage,
  whitelist: ['users', 'settings', 'logs'],
};

const reducers = combineReducers({
  user,
  settings,
  users,
  logs,
  [UserApi.reducerPath]: UserApi.reducer,
  [JobApi.reducerPath]: JobApi.reducer,
  [NotesApi.reducerPath]: NotesApi.reducer,
  [OrderApi.reducerPath]: OrderApi.reducer,
  [ShipmentApi.reducerPath]: ShipmentApi.reducer,
  [ShippingApi.reducerPath]: ShippingApi.reducer,
  [StorageApi.reducerPath]: StorageApi.reducer,
  [SupplierApi.reducerPath]: SupplierApi.reducer,
  [UsersApi.reducerPath]: UsersApi.reducer,
  [VesselApi.reducerPath]: VesselApi.reducer,
  [SecurityApi.reducerPath]: SecurityApi.reducer,
  [UtilsApi.reducerPath]: UtilsApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat([
      UserApi.middleware,
      JobApi.middleware,
      NotesApi.middleware,
      OrderApi.middleware,
      ShipmentApi.middleware,
      ShippingApi.middleware,
      StorageApi.middleware,
      SupplierApi.middleware,
      UsersApi.middleware,
      VesselApi.middleware,
      SecurityApi.middleware,
      UtilsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
