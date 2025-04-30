export interface IFactoryCore {
  createCompany: (name: string, email: string, panNumber: string) => Promise<any>;
  createProject: (companyId: string, params: any) => Promise<any>;
  getCompanyDetails: (companyId: string) => Promise<any>;
}

export interface IINR {
  checkKYCStatus: (address: string) => Promise<boolean>;
  updateKYCStatus: (address: string, status: boolean) => Promise<any>;
  transfer: (to: string, amount: string) => Promise<any>;
  balanceOf: (address: string) => Promise<string>;
}

export interface IOrderManager {
  placeOrder: (projectId: string, amount: string) => Promise<any>;
  cancelOrder: (orderId: string) => Promise<any>;
  getOrderStatus: (orderId: string) => Promise<any>;
}