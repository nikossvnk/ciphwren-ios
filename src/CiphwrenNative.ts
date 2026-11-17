// SPDX-FileCopyrightText: © 2019 EteSync Authors
// SPDX-License-Identifier: GPL-3.0-only

import { NativeModules } from "react-native";
import * as Contacts from "expo-contacts";
import { NativeContact, NativeEvent, NativeTask } from "./sync/helpers";

export type HashesForItem = [string, string, string | undefined];

export type HashDictionary = { [key: string]: HashesForItem };

export enum BatchAction {
  Add = 1,
  Change = 2,
  Delete = 3
}

interface CiphwrenNativeModule {
  hashEvent(eventId: string): Promise<string>;
  calculateHashesForEvents(calendarId: string, from: number, to: number): Promise<HashesForItem[]>;
  processEventsChanges(containerId: string, events: ([BatchAction, NativeEvent])[]): Promise<HashDictionary>;
  hashReminder(eventId: string): Promise<string>;
  calculateHashesForReminders(calendarId: string): Promise<HashesForItem[]>;
  processRemindersChanges(containerId: string, reminders: ([BatchAction, NativeTask])[]): Promise<HashDictionary>;
  hashContact(contactId: string): Promise<string>;
  calculateHashesForContacts(containerId: string): Promise<HashesForItem[]>;
  deleteContactGroupAndMembers(groupId: string): Promise<number>;
  getContainers(): Promise<(Contacts.Container & { default: boolean })[]>;
  processContactsChanges(containerId: string, groupId: string | null, contacts: ([BatchAction, NativeContact])[]): Promise<HashDictionary>;

  beginBackgroundTask(name: string): Promise<number>;
  endBackgroundTask(taskId: number): void;

  playground(param: {}): void;
}

const CiphwrenNative = NativeModules.CiphwrenNative as CiphwrenNativeModule;

export function calculateHashesForEvents(calendarId: string, from: Date, to: Date): Promise<HashesForItem[]> {
  return CiphwrenNative.calculateHashesForEvents(calendarId, from.getTime() / 1000, to.getTime() / 1000);
}

export const hashEvent = CiphwrenNative.hashEvent;

export function calculateHashesForReminders(calendarId: string): Promise<HashesForItem[]> {
  return CiphwrenNative.calculateHashesForReminders(calendarId);
}
export const processEventsChanges = CiphwrenNative.processEventsChanges;

export const hashReminder = CiphwrenNative.hashReminder;

export function calculateHashesForContacts(containerId: string): Promise<HashesForItem[]> {
  return CiphwrenNative.calculateHashesForContacts(containerId);
}
export const processRemindersChanges = CiphwrenNative.processRemindersChanges;

export const hashContact = CiphwrenNative.hashContact;
export const deleteContactGroupAndMembers = CiphwrenNative.deleteContactGroupAndMembers;
export const getContainers = CiphwrenNative.getContainers;
export const processContactsChanges = CiphwrenNative.processContactsChanges;

export const { beginBackgroundTask, endBackgroundTask } = CiphwrenNative;


export const playground = CiphwrenNative.playground;
