/**
 * Licensing API Service
 * Handles all API calls related to licensing deals in the SceneCapital platform
 */

import { toast } from "sonner";

// Licensing interfaces
export interface LicensingParty {
  id: string;
  name: string;
  type: 'individual' | 'company';
  address?: string;
  email?: string;
  walletAddress?: string;
}

export interface RoyaltyTerms {
  percentage: number;
  paymentFrequency: 'monthly' | 'quarterly' | 'annually';
  minimumGuarantee?: number;
  advancePayment?: number;
}

export interface LicensingDeal {
  id: string;
  title: string;
  description?: string;
  assetId: string;
  assetName: string;
  assetCategory: string;
  licensor: LicensingParty;
  licensee: LicensingParty;
  startDate: string;
  endDate: string;
  territory: string[];
  exclusivity: boolean;
  royaltyTerms: RoyaltyTerms;
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  createdAt: string;
  updatedAt: string;
  contractHash?: string;
  documents?: string[];
}

export interface DealsResponse {
  success: boolean;
  data?: {
    deals: LicensingDeal[];
    pagination?: {
      page: number;
      limit: number;
      totalDeals: number;
      totalPages: number;
    };
  };
  message?: string;
}

export interface DealResponse {
  success: boolean;
  data?: LicensingDeal;
  message?: string;
}

export interface CreateDealRequest {
  title: string;
  description?: string;
  assetId: string;
  assetName: string;
  assetCategory: string;
  licensor: LicensingParty;
  licensee: LicensingParty;
  startDate: string;
  endDate: string;
  territory: string[];
  exclusivity: boolean;
  royaltyTerms: RoyaltyTerms;
  documents?: string[];
}

/**
 * Fetches all licensing deals with optional filters
 */
export async function getLicensingDeals(params: {
  assetId?: string;
  status?: 'draft' | 'pending' | 'active' | 'expired' | 'terminated';
  licensorId?: string;
  licenseeId?: string;
  limit?: number;
  page?: number;
}): Promise<DealsResponse> {
  try {
    // Build query string from params
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(`/api/licensing/deals?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch licensing deals');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching licensing deals:', error);
    toast.error('Failed to load licensing deals. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Fetches a single licensing deal by ID
 */
export async function getLicensingDealById(id: string): Promise<DealResponse> {
  try {
    const response = await fetch(`/api/licensing/deals/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch licensing deal');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching licensing deal ${id}:`, error);
    toast.error('Failed to load licensing deal details. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Creates a new licensing deal
 */
export async function createLicensingDeal(dealData: CreateDealRequest): Promise<DealResponse> {
  try {
    // Transform the request to match API expectations
    const payload = {
      ...dealData,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch('/api/licensing/deals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create licensing deal');
    }

    const result = await response.json();
    toast.success('Licensing deal created successfully');
    return result;
  } catch (error) {
    console.error('Error creating licensing deal:', error);
    toast.error('Failed to create licensing deal. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Updates an existing licensing deal
 */
export async function updateLicensingDeal(id: string, updates: Partial<LicensingDeal>): Promise<DealResponse> {
  try {
    // Add updated timestamp
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const response = await fetch(`/api/licensing/deals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update licensing deal');
    }

    const result = await response.json();
    toast.success('Licensing deal updated successfully');
    return result;
  } catch (error) {
    console.error(`Error updating licensing deal ${id}:`, error);
    toast.error('Failed to update licensing deal. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}

/**
 * Deletes a licensing deal
 */
export async function deleteLicensingDeal(id: string): Promise<DealResponse> {
  try {
    const response = await fetch(`/api/licensing/deals/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete licensing deal');
    }

    const result = await response.json();
    toast.success('Licensing deal deleted successfully');
    return result;
  } catch (error) {
    console.error(`Error deleting licensing deal ${id}:`, error);
    toast.error('Failed to delete licensing deal. Please try again.');
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
  }
}
