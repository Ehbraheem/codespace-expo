/* eslint-disable no-bitwise */
/* eslint-disable no-unused-vars */
export interface User {
  expire: string | null;
  firstName: string | null;
  id: string | null;
  lastName: string | null;
  refreshToken: string | null;
  token: string | null;
  userName: string | null;
}

export interface Job {
  businessUnit: string | null;
  blNumber: string | null;
  noOfContainers: number | null;
  jobReferenceNumber: string | null;
  agentId: string | null;
  orderId: number | null;
  created: string | null;
  lastModified: string | null;
  status: number | null;
}

export interface Order {
  vesselId: number | null;
  title: string | null;
  shipping?: {
    created: string | null;
    createdBy: string | null;
    lastModified: string | null;
    lastModifiedBy: string | null;
    shippingId: number | null;
    origin: string | null;
    portOfLoading: string | null;
    poNumber: string | null;
    destination: string | null;
    description: string | null;
    edd: string | null;
    orderType: string | null;
    incoterm: string | null;
    orderSize: string | null;
    orderId: number | null;
    shippingDocsId: number | null;
    orders: [
      {
        created: string | null;
        createdBy: string | null;
        lastModified: string | null;
        lastModifiedBy: string | null;
        orderId: number | null;
        title: string | null;
        buProject: string | null;
        orderStatus: number | null;
        accepted: boolean;
        vesselId: number | null;
        supplierId: number | null;
        shippingId: number | null;
        shipping: string | null;
        supplier: string | null;
        vessel: string | null;
        domainEvents: {
          isPublished: boolean;
          dateOccurred: string | null;
        }[];
      },
    ];
    doc?: {
      created: '2023-01-26T07:59:03.792Z';
      createdBy: string | null;
      lastModified: '2023-01-26T07:59:03.792Z';
      lastModifiedBy: string | null;
      shippingDocsId: number | null;
      contentType: string | null;
      path: string | null;
      documentName: string | null;
      typeId: number | null;
      documentCategory: number | null;
      shippings: string[];
      domainEvents: {
        isPublished: boolean;
        dateOccurred: string | null;
      }[];
    } | null;
    domainEvents: {
      isPublished: boolean;
      dateOccurred: string | null;
    }[];
  } | null;
  supplier: {
    created: string | null;
    createdBy: string | null;
    lastModified: string | null;
    lastModifiedBy: string | null;
    supplierId: number | null;
    name: string | null;
    email: string | null;
    address: string | null;
    country: string | null;
    phone: string | null;
    orderId: number | null;
    orders: [
      {
        created: '2023-01-26T07:59:03.793Z';
        createdBy: string | null;
        lastModified: '2023-01-26T07:59:03.793Z';
        lastModifiedBy: string | null;
        orderId: number | null;
        title: string | null;
        buProject: string | null;
        orderStatus: number | null;
        accepted: boolean;
        vesselId: number | null;
        supplierId: number | null;
        shippingId: number | null;
        shipping: string | null;
        supplier: string | null;
        vessel: string | null;
        domainEvents: {
          isPublished: boolean;
          dateOccurred: string | null;
        }[];
      },
    ];
    domainEvents: {
      isPublished: boolean;
      dateOccurred: string | null;
    }[];
  };
  vessel?: {
    created: string | null;
    createdBy: string | null;
    lastModified: string | null;
    lastModifiedBy: string | null;
    vesselId: number | null;
    name: string | null;
    type: string | null;
    size: string | null;
    owner: string | null;
    consignment: number | null;
    image: string | null;
    status: string | null;
    orderSize: number | null;
    cargoDetail: string | null;
    billOfLaden: string | null;
    portOfLoading: string | null;
    orderType: string | null;
    poNumber: number | null;
    incoterm: string | null;
    orderId: number | null;
    orders: [
      {
        created: string | null;
        createdBy: string | null;
        lastModified: string | null;
        lastModifiedBy: string | null;
        orderId: number | null;
        title: string | null;
        buProject: string | null;
        orderStatus: number | null;
        accepted: boolean;
        vesselId: number | null;
        supplierId: number | null;
        shippingId: number | null;
        shipping: string | null;
        supplier: string | null;
        vessel: string | null;
        domainEvents: {
          isPublished: boolean;
          dateOccurred: string | null;
        }[];
      },
    ];
    done: boolean;
    domainEvents: {
      isPublished: boolean;
      dateOccurred: string | null;
    }[];
  } | null;
  note?: Note | null;
  orderId: number | null;
  buProject: string | null;
  accepted: boolean;
  supplierId: number | null;
  shipperId: number | null;
  orderStatus: number | null;
}

export interface Note {
  created: string | null;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
  noteId: number | null;
  noteType: number | null;
  title: string | null;
  body: string | null;
  userName: string | null;
  resolved: boolean;
  resolvedAt: string | null;
  groupId: number | null;
  domainEvents: {
    isPublished: boolean;
    dateOccurred: string | null;
  }[];
}

export interface Role {
  id: number;
  orderId: number;
  vesselId: number;
  portOfLoading: string | null;
  portOfDischarge: string | null;
  cargoDetail: string | null;
  loadingDate: string | null;
  arrivalDate: string | null;
  poNumber: string | null;
  blNumber: string | null;
  shippingLine: string | null;
}

export interface Shipment {
  id: number;
  orderId: number;
  vesselId: number;
  portOfLoading: string | null;
  portOfDischarge: string | null;
  cargoDetail: string | null;
  loadingDate: string | null;
  arrivalDate: string | null;
  poNumber: string | null;
  blNumber: string | null;
  shippingLine: string | null;
}

export interface Shipping {
  shippingId: number;
  origin: string | null;
  portOfLoading: string | null;
  poNumber: string | null;
  destination: string | null;
  description: string | null;
  edd: string | null;
  orderType: string | null;
  incoterm: string | null;
  orderSize: string | null;
  docId: string | null;
}

export interface Supplier {
  name: string | null;
  email: string | null;
  country: string | null;
  phone: string | null;
  address: string | null;
  supplierId: number;
}

export interface Users {
  id: string;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  emailConfirmed: string | null;
  phoneNumberConfirmed: string | null;
  dateOfBirth: string | null;
  gender: number;
  isActive: true;
  businessUnit: number[];
  userType: number;
  staffType: number | string;
  department: number | string;
  companyName: string;
  userStatus: string;
  refineryZones: string;
}

export interface Vessel {
  vesselId: number;
  name: string | null;
  type: string | null;
  size: string | null;
  owner: string | null;
  consignment: number;
  image: string | null;
  status: string | null;
  orderSize: number;
  cargoDetail: string | null;
  billOfLaden: string | null;
  portOfLoading: string | null;
  orderType: string | null;
  poNumber: number;
  incoterm: string | null;
  createdBy: string | null;
  lastModified: string | null;
  lastModifiedBy: string | null;
  created: string | null;
}

export enum Department {
  Security = 0,
  IT = 1,
  Finance = 2,
  Procurement = 3,
  RefineryAmin = 4,
  GroupRisk = 5,
}

export enum StaffType {
  Contractor = 0,
  Permanent = 1,
  Visitor = 2,
}

export enum RefineryZone {
  AA = 0,
  A1 = 1,
  A2 = 1 << 1, // 2
  A3 = 1 << 2, // 4
  B1 = 1 << 3, // 8
  B2 = 1 << 4, // 16
  B3 = 1 << 5, // 32

  B4 = 1 << 6, // 64
}

export enum UserStatus {
  Active = 0,
  Suspended = 1,
  Locked = 2,
  Expired = 3,
  Exited = 4,
}

export enum JacketSize {
  XSmall = 0,
  Small = 1,
  Medium = 2,
  Large = 3,
  XLarge = 4,
  XXLarge = 5,
}
