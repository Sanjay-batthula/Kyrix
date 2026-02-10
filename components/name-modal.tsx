"use client"
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

export default function NameModal({ open, name, setName, onSave }: {
  open: boolean;
  name: string;
  setName: (name: string) => void;
  onSave: () => void;
}) {
  if (!open) return null;
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your name</DialogTitle>
        </DialogHeader>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="w-full p-2 border rounded"
        />
        <DialogFooter>
          <button
            onClick={onSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={!name.trim()}
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
