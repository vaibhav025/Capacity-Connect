import { useReducedMotion } from "../../lib/motion";
import { Reorder, useDragControls } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { AnimatedButtons } from "../ui/AnimatedButtons";
type Asset = { id: string; file: File };
function AssetRow({
  asset,
  index,
  count,
  move,
  remove,
}: {
  asset: Asset;
  index: number;
  count: number;
  move: (from: number, to: number) => void;
  remove: () => void;
}) {
  const controls = useDragControls();
  const reduce = useReducedMotion();
  return (
    <Reorder.Item
      value={asset}
      dragListener={false}
      dragControls={controls}
      className="asset-row"
      transition={{ duration: reduce ? 0 : 0.2 }}
      whileDrag={{ boxShadow: "0 12px 30px #12344a25", zIndex: 2 }}
    >
      <button
        type="button"
        aria-label={`Drag ${asset.file.name}`}
        className="drag-handle"
        onPointerDown={(event) => controls.start(event)}
      >
        <GripVertical size={18} />
      </button>
      <FileText size={18} />
      <span className="min-w-0 flex-1 truncate">
        {asset.file.name}
        <small>
          {(asset.file.size / 1024 / 1024).toFixed(1)} MB · Local draft
        </small>
      </span>
      <AnimatedButtons
        aria-label={`Move ${asset.file.name} up`}
        disabled={index === 0}
        onClick={() => move(index, index - 1)}
      >
        <ArrowUp size={16} />
      </AnimatedButtons>
      <AnimatedButtons
        aria-label={`Move ${asset.file.name} down`}
        disabled={index === count - 1}
        onClick={() => move(index, index + 1)}
      >
        <ArrowDown size={16} />
      </AnimatedButtons>
      <AnimatedButtons
        aria-label={`Remove ${asset.file.name}`}
        onClick={remove}
      >
        <X size={16} />
      </AnimatedButtons>
    </Reorder.Item>
  );
}
export function DragDropContentUploader() {
  const input = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [error, setError] = useState("");
  const add = (files: FileList | null) => {
    const candidates = Array.from(files || []);
    const valid = candidates.filter(
      (file) =>
        /\.(pdf|ppt|pptx|mp4|webm)$/i.test(file.name) &&
        file.size <= 100 * 1024 * 1024,
    );
    setError(
      valid.length !== candidates.length
        ? "Use PDF, PowerPoint, MP4 or WebM files under 100 MB."
        : "",
    );
    setAssets((previous) => [
      ...previous,
      ...valid.map((file) => ({ id: crypto.randomUUID(), file })),
    ]);
  };
  const move = (from: number, to: number) =>
    setAssets((previous) => {
      const next = [...previous];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  return (
    <section className="panel mb-6">
      <h3>Build your learning path</h3>
      <p className="my-3 text-xs text-slate-500">
        Stage and reorder local files. Publishing requires a connected storage
        service.
      </p>
      <div
        className={`drop-zone ${dragging ? "dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          depth.current++;
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => {
          if (--depth.current <= 0) setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          depth.current = 0;
          setDragging(false);
          add(event.dataTransfer.files);
        }}
      >
        <Upload size={28} />
        <strong>Drop your next great lesson here</strong>
        <span>PDF, PowerPoint or video · up to 100 MB each</span>
        <AnimatedButtons
          className="secondary"
          onClick={() => input.current?.click()}
        >
          Browse files
        </AnimatedButtons>
        <input
          ref={input}
          type="file"
          multiple
          accept=".pdf,.ppt,.pptx,.mp4,.webm"
          className="sr-only"
          tabIndex={-1}
          aria-label="Course content files"
          onChange={(event) => {
            add(event.target.files);
            event.target.value = "";
          }}
        />
      </div>
      {error && (
        <p role="alert" className="mt-3 text-red-700">
          {error}
        </p>
      )}
      <Reorder.Group
        axis="y"
        values={assets}
        onReorder={setAssets}
        className="mt-4 space-y-2"
        aria-label="Course module order"
      >
        {assets.map((asset, index) => (
          <AssetRow
            key={asset.id}
            asset={asset}
            index={index}
            count={assets.length}
            move={move}
            remove={() =>
              setAssets((previous) =>
                previous.filter((item) => item.id !== asset.id),
              )
            }
          />
        ))}
      </Reorder.Group>
      <p role="status" className="mt-3 text-xs text-slate-500">
        {assets.length} files staged for this session
      </p>
    </section>
  );
}
