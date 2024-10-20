import { NavigatorScreenParams } from '@react-navigation/native';
import { Order } from './types';

export type MainStack = {
  Splash: undefined;
  SelectWindow: undefined;
  SecurityScan: {
    qrdata?: string;
  };
  QRScan: undefined;
  SignIn: undefined;
  Tab: NavigatorScreenParams<BottomTabList>;
  Shipments: undefined;
  CreateNewUser: undefined;
  OrderReport: {
    order: Order;
  };
};

export type DrawerList = {
  Dashboard: NavigatorScreenParams<MainStack>;
  Profile: undefined;
  Users: undefined;
  Suppliers: undefined;
  Settings: undefined;
};

export type BottomTabList = {
  Home: undefined;
  Jobs: undefined;
  Reports: undefined;
  Agents: undefined;
};
