"use client";

import { useActionState } from "react";
import type { InstrumentModel } from "@/generated/prisma/models";
import {
  createInstrumentAction,
  updateInstrumentAction,
  type FormState,
} from "../actions";

type Props = {
  instrument?: InstrumentModel;
};

export default function InstrumentForm({ instrument }: Props) {
  const action = instrument ? updateInstrumentAction : createInstrumentAction;
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    undefined,
  );
  const idSuffix = instrument?.id ?? "new";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {instrument ? (
        <input type="hidden" name="id" value={instrument.id} />
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`symbol-${idSuffix}`} className="text-sm font-medium">
            Simbol *
          </label>
          <input
            id={`symbol-${idSuffix}`}
            name="symbol"
            required
            placeholder="AAPL"
            defaultValue={instrument?.symbol}
            className="input font-mono uppercase"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`name-${idSuffix}`} className="text-sm font-medium">
            Nama *
          </label>
          <input
            id={`name-${idSuffix}`}
            name="name"
            required
            placeholder="Apple Inc."
            defaultValue={instrument?.name}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`exchange-${idSuffix}`} className="text-sm font-medium">
            Bursa
          </label>
          <input
            id={`exchange-${idSuffix}`}
            name="exchange"
            placeholder="NasdaqGS"
            defaultValue={instrument?.exchange ?? ""}
            className="input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`sector-${idSuffix}`} className="text-sm font-medium">
            Sektor
          </label>
          <input
            id={`sector-${idSuffix}`}
            name="sector"
            placeholder="Teknologi"
            defaultValue={instrument?.sector ?? ""}
            className="input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`note-${idSuffix}`} className="text-sm font-medium">
          Catatan Riset
        </label>
        <textarea
          id={`note-${idSuffix}`}
          name="note"
          rows={3}
          defaultValue={instrument?.note ?? ""}
          className="input resize-y"
        />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={instrument?.featured ?? false}
          className="h-4 w-4 accent-[var(--accent)]"
        />
        Tandai unggulan
      </label>

      {state?.error ? (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {state.error}
        </p>
      ) : null}
      {state?.success ? (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
          {state.success}
        </p>
      ) : null}

      <button type="submit" disabled={pending} className="btn-primary self-start">
        {pending
          ? "Menyimpan..."
          : instrument
            ? "Simpan Perubahan"
            : "Tambah Instrumen"}
      </button>
    </form>
  );
}
