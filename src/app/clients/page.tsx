"use client";

import { useEffect, useState } from "react";
import { getClients, reorderClients, updateClientStage, Client } from "@/lib/api";
import { Plus, MoreHorizontal, MessageSquare, Paperclip, Calendar, GripVertical } from "lucide-react";
import AddClientModal from "@/components/AddClientModal";
import ClientDrawer from "@/components/ClientDrawer";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAGES = ["New Lead", "Contacted", "Viewing Scheduled", "Offer Made", "Closed"];

const STAGE_STYLES: Record<string, { dot: string; header: string }> = {
  "New Lead":          { dot: "bg-purple-500",  header: "border-purple-200" },
  "Contacted":         { dot: "bg-orange-500",  header: "border-orange-200" },
  "Viewing Scheduled": { dot: "bg-yellow-400",  header: "border-yellow-200" },
  "Offer Made":        { dot: "bg-blue-500",    header: "border-blue-200"   },
  "Closed":            { dot: "bg-emerald-500", header: "border-emerald-200"},
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => { loadClients(); }, []);

  async function loadClients() {
    try {
      const data = await getClients();
      setClients((data || []).sort((a, b) => (a.position_index ?? 0) - (b.position_index ?? 0)));
    } catch (e) {
      console.error("Error loading clients:", e);
    } finally {
      setLoading(false);
    }
  }

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // ── Drag handlers ──────────────────────────────────────────────────────────

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;

    const draggedId  = active.id as string;
    const overId     = over.id  as string;

    if (draggedId === overId) return;

    // Determine which stage the dragged card is moving TO
    const overIsStage  = STAGES.includes(overId);              // dropped onto a column
    const overIsCard   = !overIsStage;                          // dropped onto another card

    const targetStage = overIsStage
      ? overId
      : clients.find(c => c.id === overId)?.pipeline_stage ?? null;

    if (!targetStage) return;

    setClients(prev => {
      const draggedIdx = prev.findIndex(c => c.id === draggedId);
      if (draggedIdx === -1) return prev;
      const dragged = prev[draggedIdx];

      // Nothing changes if same stage drop on column header
      if (overIsStage && dragged.pipeline_stage === targetStage) return prev;

      const next = [...prev];
      // Remove dragged item
      next.splice(draggedIdx, 1);
      // Place it at the right position
      if (overIsCard && dragged.pipeline_stage !== targetStage) {
        // Moving to another column: insert before the target card
        const targetIdx = next.findIndex(c => c.id === overId);
        next.splice(targetIdx >= 0 ? targetIdx : next.length, 0, {
          ...dragged,
          pipeline_stage: targetStage,
        });
      } else if (overIsCard) {
        // Same column reorder: insert before target card
        const targetIdx = next.findIndex(c => c.id === overId);
        next.splice(targetIdx >= 0 ? targetIdx : next.length, 0, dragged);
      } else {
        // Dropped onto column: append to end of that column
        const lastInTargetIdx = next.reduce(
          (acc, c, i) => (c.pipeline_stage === targetStage ? i : acc),
          -1
        );
        next.splice(lastInTargetIdx + 1, 0, {
          ...dragged,
          pipeline_stage: targetStage,
        });
      }
      return next;
    });
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over) return;

    const draggedId = active.id as string;
    const overId    = over.id  as string;

    // Final local state after all onDragOver mutations
    const draggedClient = clients.find(c => c.id === draggedId);
    if (!draggedClient) return;

    const overIsStage = STAGES.includes(overId);
    const targetStage = overIsStage
      ? overId
      : clients.find(c => c.id === overId)?.pipeline_stage ?? draggedClient.pipeline_stage;

    // Re-index positions per column and collect updates
    const updates: { id: string; position_index: number; pipeline_stage: string }[] = [];

    STAGES.forEach(stage => {
      clients
        .filter(c => c.pipeline_stage === stage)
        .forEach((c, idx) => {
          updates.push({ id: c.id, position_index: idx, pipeline_stage: stage });
        });
    });

    // Persist to database
    try {
      // 1. If stage changed, update stage first (for instant UI correctness)
      if (draggedClient.pipeline_stage !== targetStage) {
        await updateClientStage(draggedId, targetStage);
      }
      // 2. Save full ordering
      if (updates.length > 0) {
        await reorderClients(updates);
      }
    } catch (e) {
      console.error("Failed to persist reorder", e);
    }
  }

  function handleNotesUpdated(clientId: string, notes: string) {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, notes } : prev);
    }
  }

  const activeClient = activeId ? clients.find(c => c.id === activeId) ?? null : null;

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] overflow-hidden">
      {/* ── Header ── */}
      <div className="flex items-center gap-4 mb-6 shrink-0">
        <h1 className="text-2xl font-semibold text-gray-900">Deals pipeline</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Plus size={15} /> New Deal
        </button>
      </div>

      <AddClientModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={loadClients} />
      <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} onNotesUpdated={handleNotesUpdated} />

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-gray-400">Loading pipeline...</div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex-1 flex overflow-x-auto overflow-y-hidden gap-5 pb-4">
            <div className="flex gap-5 h-full min-w-max">
              {STAGES.map(stage => {
                const stageClients = clients.filter(c => (c.pipeline_stage ?? "New Lead") === stage);
                return (
                  <KanbanColumn
                    key={stage}
                    stage={stage}
                    clients={stageClients}
                    onClientClick={setSelectedClient}
                  />
                );
              })}
            </div>
          </div>

          {/* Drag overlay — clean lifted card, no transforms */}
          <DragOverlay dropAnimation={null}>
            {activeClient ? <ClientCard client={activeClient} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}

// ─── Kanban Column ────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  clients,
  onClientClick,
}: {
  stage: string;
  clients: Client[];
  onClientClick: (c: Client) => void;
}) {
  // Make the column itself a droppable zone (critical for cross-column drops)
  const { setNodeRef, isOver } = useDroppable({ id: stage });
  const style = STAGE_STYLES[stage] ?? { dot: "bg-gray-400", header: "border-gray-200" };

  return (
    <div className="w-[300px] flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm h-full max-h-full overflow-hidden">
      {/* Column header */}
      <div className="px-4 py-3.5 border-b border-gray-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${style.dot}`} />
          <h3 className="font-semibold text-gray-900 text-sm">
            {stage}{" "}
            <span className="text-gray-400 font-normal ml-1 text-xs">{clients.length}</span>
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Plus size={15} className="cursor-pointer hover:text-gray-900 transition-colors" />
          <MoreHorizontal size={15} className="cursor-pointer hover:text-gray-900 transition-colors" />
        </div>
      </div>

      {/* Scrollable card area — this is the droppable node */}
      <div
        ref={setNodeRef}
        className={`flex-1 p-2.5 overflow-y-auto flex flex-col gap-2.5 min-h-[120px] transition-colors duration-150
          ${isOver ? "bg-indigo-50/60" : "bg-gray-50/50"}`}
      >
        <SortableContext
          items={clients.map(c => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {clients.map(client => (
            <SortableClientCard
              key={client.id}
              client={client}
              onClick={() => onClientClick(client)}
            />
          ))}
        </SortableContext>

        {clients.length === 0 && (
          <div className="flex-1 min-h-[80px] flex items-center justify-center text-[12px] font-medium text-gray-400 border-2 border-dashed border-gray-200 rounded-xl transition-colors duration-150">
            {isOver ? "Release to drop" : "Empty"}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sortable Card Wrapper ────────────────────────────────────────────────────

function SortableClientCard({ client, onClick }: { client: Client; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: client.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition ?? "transform 150ms linear",
        // Invisible placeholder — DragOverlay renders the visual card
        opacity: isDragging ? 0 : 1,
        pointerEvents: isDragging ? "none" : undefined,
      }}
      {...attributes}
      {...listeners}
    >
      <ClientCard client={client} onClick={onClick} />
    </div>
  );
}

// ─── Client Card ──────────────────────────────────────────────────────────────

function ClientCard({
  client,
  isOverlay,
  onClick,
}: {
  client: Client;
  isOverlay?: boolean;
  onClick?: () => void;
}) {
  function getStatusBadge(status: string) {
    switch (status?.toLowerCase()) {
      case "hot":  return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100  text-rose-700  uppercase tracking-wider">High</span>;
      case "warm": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Medium</span>;
      case "cold": return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100  text-blue-700  uppercase tracking-wider">Low</span>;
      default:     return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100  text-gray-700  uppercase tracking-wider">{status ?? "—"}</span>;
    }
  }

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl p-3.5 w-full select-none group
        cursor-grab active:cursor-grabbing
        transition-shadow duration-150 ease-out
        ${isOverlay ? "shadow-2xl ring-2 ring-indigo-300" : "shadow-sm hover:shadow-md hover:border-indigo-200"}
      `}
    >
      {/* Card header */}
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[11px] font-medium text-gray-400">
          #{client.id.slice(0, 8).toUpperCase()}
        </span>
        <div className="flex items-center gap-2">
          {getStatusBadge(client.status)}
          <GripVertical size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
        </div>
      </div>

      <h4 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5">{client.name}</h4>
      <p className="text-xs text-gray-400 mb-3">{client.email}</p>

      <div className="text-sm font-bold text-gray-900 mb-3">$1,250,000</div>

      <div className="space-y-1.5 border-t border-gray-100 pt-3 mb-3">
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center text-gray-400 gap-1"><Calendar size={11} /> Created</span>
          <span className="text-gray-700 font-medium">
            {new Date(client.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-gray-400">Phone</span>
          <span className="text-gray-700 font-medium">{client.phone}</span>
        </div>
      </div>

      {client.notes && (
        <p className="text-[11px] text-gray-400 italic border-t border-gray-100 pt-2.5 mb-2.5 truncate">
          &ldquo;{client.notes}&rdquo;
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2.5 border-t border-gray-100">
        <div className="flex gap-1">
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-purple-100 text-purple-700">B</span>
          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold bg-blue-100   text-blue-700">K</span>
        </div>
        <div className="flex gap-3 text-[11px] font-medium text-gray-500">
          <span className="flex items-center gap-1"><MessageSquare size={11} /> 3</span>
          <span className="flex items-center gap-1"><Paperclip size={11} /> 1</span>
        </div>
      </div>
    </div>
  );
}
