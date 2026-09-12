// src/services/addressService.js
//
// Local, localStorage-backed address book (one demo user's saved
// addresses live here). Function names and return shapes are
// unchanged from the real-backend version — each already unwrapped
// down to the plain address object/array, which is exactly what
// UserDashboard.jsx and Setting.jsx already expect, so neither needed
// to change.

import { readLocal, writeLocal, simulateDelay, mockError, generateId } from "../utils/mockApi";

const ADDRESSES_KEY = "addresses";

const readAddresses = () => readLocal(ADDRESSES_KEY, []);
const writeAddresses = (list) => writeLocal(ADDRESSES_KEY, list);

export const getAddresses = async () => {
  await simulateDelay();
  return readAddresses();
};

export const getDefaultAddress = async () => {
  await simulateDelay();
  const addresses = readAddresses();
  return addresses.find((a) => a.isDefault) || addresses[0] || null;
};

export const getAddress = async (id) => {
  await simulateDelay();
  const address = readAddresses().find((a) => a._id === id);
  if (!address) mockError(404, "Address not found");
  return address;
};

export const createAddress = async (address) => {
  await simulateDelay(300);

  const addresses = readAddresses();
  const newAddress = {
    _id: `addr-${generateId()}`,
    ...address,
    isDefault: address.isDefault ?? addresses.length === 0,
  };

  if (newAddress.isDefault) {
    addresses.forEach((a) => { a.isDefault = false; });
  }

  addresses.push(newAddress);
  writeAddresses(addresses);
  return newAddress;
};

export const updateAddress = async ({ id, address }) => {
  await simulateDelay(300);

  const addresses = readAddresses();
  const index = addresses.findIndex((a) => a._id === id);
  if (index === -1) mockError(404, "Address not found");

  addresses[index] = { ...addresses[index], ...address, _id: id };
  writeAddresses(addresses);
  return addresses[index];
};

export const deleteAddress = async (id) => {
  await simulateDelay(300);

  let addresses = readAddresses();
  const wasDefault = addresses.find((a) => a._id === id)?.isDefault;
  addresses = addresses.filter((a) => a._id !== id);

  if (wasDefault && addresses.length > 0) {
    addresses[0].isDefault = true;
  }

  writeAddresses(addresses);
  return { success: true };
};

export const setDefaultAddress = async (id) => {
  await simulateDelay(300);

  const addresses = readAddresses();
  addresses.forEach((a) => { a.isDefault = a._id === id; });
  writeAddresses(addresses);
  return addresses.find((a) => a._id === id);
};
