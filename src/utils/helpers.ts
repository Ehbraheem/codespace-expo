import Config from 'react-native-config';
const { BASE_URL } = Config;
// console.log('BASE_URL', BASE_URL);

export const numberWithCommas = (x: number, decimals?: number) => {
  return x.toFixed(decimals || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const frequency = ['Daily', 'Weekly', 'Monthly', 'Yearly'];

export const addAlpha = (color: string, opacity: number) => {
  // coerce values so ti is between 0 and 1.
  var _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  return color + _opacity.toString(16).toUpperCase();
};

export const datesDiff = (startDate: Date, endDate: Date) => {
  const diff = Math.abs(startDate.getTime() - endDate.getTime());
  const diffDays = Math.ceil(diff / (1000 * 3600 * 24));
  return diffDays;
};

export const weeksDiff = (startDate: Date, endDate: Date) => {
  const diff = Math.abs(startDate.getTime() - endDate.getTime());
  const diffWeeks = Math.ceil(diff / (1000 * 3600 * 24 * 7));
  return diffWeeks;
};

export const monthsDiff = (startDate: Date, endDate: Date) => {
  const diff = Math.abs(startDate.getTime() - endDate.getTime());
  const diffMonths = Math.ceil(diff / (1000 * 3600 * 24 * 30));
  return diffMonths;
};

export const yearsDiff = (startDate: Date, endDate: Date) => {
  const diff = Math.abs(startDate.getTime() - endDate.getTime());
  const diffYears = Math.ceil(diff / (1000 * 3600 * 24 * 365.25));
  return diffYears;
};

export const getBaseUrl = () => {
  // return 'https://api.test.dangote.islands.digital/api';
  return BASE_URL;
};

export const makeCamelCase = (str: string) => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) {
      return '';
    } // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  });
};

export const shippingStatuses = [
  {
    annotation: 0,
    title: 'New',
  },
  {
    annotation: 1,
    title: 'Awaiting Shipping',
  },
  {
    annotation: 2,
    title: 'On Board',
  },
  {
    annotation: 3,
    title: 'In Transit',
  },
  {
    annotation: 4,
    title: 'Awaiting Clearance',
  },
  {
    annotation: 5,
    title: 'Cleared',
  },
  {
    annotation: 6,
    title: 'Dispatched',
  },
  {
    annotation: 7,
    title: 'Queried',
  },
];

export const UserTypes = [
  {
    annotation: 1,
    title: 'Admin',
  },
  {
    annotation: 2,
    title: 'Standard',
  },
  {
    annotation: 3,
    title: 'Agent',
  },
  {
    annotation: 4,
    title: 'Procurement',
  },
  {
    annotation: 5,
    title: 'Logistics',
  },
  {
    annotation: 6,
    title: 'Freight Manager',
  },
];

export const jobStatuses = ['Pending', 'Completed', 'In Progress'];

export const businessUnits = [
  {
    title: 'AgroSack',
    annotation: 0,
  },
  {
    title: 'Rice',
    annotation: 1,
  },
  {
    title: 'Sugar',
    annotation: 2,
  },
  {
    title: 'Refinery',
    annotation: 3,
  },
  {
    title: 'Fertilizer',
    annotation: 4,
  },
  {
    title: 'IT',
    annotation: 5,
  },
  {
    title: 'Cement',
    annotation: 6,
  },
];

export const logBaseUrl = 'https://sj.api.dev.dangote.islands.digital';

export const Department = [
  'Security',
  'IT',
  'Finance',
  'Procurement',
  'RefineryAmin',
  'GroupRisk',
];

export const StaffType = ['Contractor', 'Permanent', 'Visitor'];

export const UserStatus = [
  'Active',
  'Suspended',
  'Locked',
  'Expired',
  'Exited',
];
