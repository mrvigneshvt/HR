import { Client } from '../services/clientService';

export interface ValidationErrors {
  [key: string]: string;
}

export const validateClientForm = (data: Partial<Client>): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.clientName?.trim()) {
    errors.clientName = 'Client name is required';
  }

  if (!data.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }

  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\d{10}$/.test(data.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be 10 digits';
  }

  if (!data.gstNumber?.trim()) {
    errors.gstNumber = 'GST number is required';
  } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstNumber)) {
    errors.gstNumber = 'Invalid GST number format';
  }

  if (!data.site?.trim()) {
    errors.site = 'Site is required';
  }

  if (!data.branch?.trim()) {
    errors.branch = 'Branch is required';
  }

  if (!data.address?.trim()) {
    errors.address = 'Address is required';
  }

  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  }

  if (!data.latitude?.trim()) {
    errors.latitude = 'Latitude is required';
  } else if (isNaN(Number(data.latitude)) || Number(data.latitude) < -90 || Number(data.latitude) > 90) {
    errors.latitude = 'Invalid latitude value';
  }

  if (!data.longitude?.trim()) {
    errors.longitude = 'Longitude is required';
  } else if (isNaN(Number(data.longitude)) || Number(data.longitude) < -180 || Number(data.longitude) > 180) {
    errors.longitude = 'Invalid longitude value';
  }

  if (!data.status) {
    errors.status = 'Status is required';
  }

  if (!data.checkIn?.trim()) {
    errors.checkIn = 'Check-in time is required';
  } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data.checkIn)) {
    errors.checkIn = 'Invalid time format (HH:MM:SS)';
  }

  if (!data.lunch_time?.trim()) {
    errors.lunch_time = 'Lunch time is required';
  } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data.lunch_time)) {
    errors.lunch_time = 'Invalid time format (HH:MM:SS)';
  }

  if (!data.check_out?.trim()) {
    errors.check_out = 'Check-out time is required';
  } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data.check_out)) {
    errors.check_out = 'Invalid time format (HH:MM:SS)';
  }

  return errors;
}; 

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
} 

export const convertFormet = (date:Date) => {
  const now = new Date(date);
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
  const year = now.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate
}


export function convertTo12HourFormat(time24:string) {
  const [hourStr, minuteStr] = time24.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = minuteStr;
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12; // Convert '0' to '12'

  return `${hour}:${minute} ${ampm}`;
}