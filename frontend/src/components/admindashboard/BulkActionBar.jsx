import {
  Trash2,
  RotateCcw,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

const BulkActionBar = ({
  selectedCount = 0,
  onDelete,
  onRestore,
  onActivate,
  onDeactivate,
  onClear,
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-4 z-20 mb-6 rounded-2xl border border-primary/20 bg-white p-4 shadow-lg mt-3">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between font-pop">
        {/* Left */}
        <div className="flex items-center gap-3">
          <span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-primary text-white font-bold">
            {selectedCount}
          </span>

          <div>
            <h3 className="font-semibold text-gray-900">
              {selectedCount} Product
              {selectedCount > 1 ? "s" : ""} Selected
            </h3>

            <p className="text-sm text-gray-500">
              Choose an action to apply to all selected products.
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onActivate}
            disabled={!selectedCount}
            className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CheckCircle2 size={18} />
            Activate
          </button>

          <button
            onClick={onDeactivate}
            disabled={!selectedCount}
            className="flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <XCircle size={18} />
            Deactivate
          </button>

          <button
            onClick={onRestore}
            disabled={!selectedCount}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw size={18} />
            Restore
          </button>

          <button
            onClick={onDelete}
            disabled={!selectedCount}
            className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 size={18} />
            Delete
          </button>

          <button
            onClick={onClear}
            className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium transition hover:bg-gray-100"
          >
            <X size={18} />
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;