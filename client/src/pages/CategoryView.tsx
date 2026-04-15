import { useRoute } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BrutalistDashboard } from "@/components/BrutalistDashboard";
import { NoteCard } from "@/components/NoteCard";
import { Loader2 } from "lucide-react";
import { NoteCategory } from "@shared/types";

export default function CategoryView() {
  const { user } = useAuth();
  const [match, params] = useRoute("/category/:category");

  const category = params?.category as NoteCategory | undefined;

  // Queries
  const { data: notes = [], isLoading, refetch } = trpc.notes.listByCategory.useQuery(
    { category: category || "Tasks" },
    { enabled: !!category }
  );

  // Mutations
  const deleteNoteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const toggleCompleteMutation = trpc.notes.toggleComplete.useMutation({
    onSuccess: () => refetch(),
  });

  if (!user || !category) return null;

  const categoryInfo: Record<NoteCategory, { icon: string; color: string; description: string }> = {
    Tasks: {
      icon: "✓",
      color: "bg-blue-600",
      description: "Action items and todos",
    },
    Deadlines: {
      icon: "⏰",
      color: "bg-red-600",
      description: "Time-sensitive deliverables",
    },
    Schedule: {
      icon: "📅",
      color: "bg-green-600",
      description: "Appointments and events",
    },
    Thoughts: {
      icon: "💭",
      color: "bg-purple-600",
      description: "Ideas and reflections",
    },
    Learning: {
      icon: "📚",
      color: "bg-yellow-600",
      description: "Knowledge and insights",
    },
  };

  const info = categoryInfo[category];

  return (
    <BrutalistDashboard currentCategory={category}>
      <div className="bg-black text-white min-h-screen">
        {/* Header */}
        <div className="border-b-2 border-white p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`${info.color} w-12 h-12 flex items-center justify-center text-white font-bold text-2xl`}>
              {info.icon}
            </div>
            <div>
              <h1 className="text-6xl font-bold">{category.toUpperCase()}</h1>
              <p className="text-gray-400 text-lg">{info.description}</p>
            </div>
          </div>
          <div className="h-1 bg-red-600 w-24"></div>
        </div>

        {/* Notes List */}
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-6">
            {notes.length} {notes.length === 1 ? "NOTE" : "NOTES"}
          </h2>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : notes.length === 0 ? (
            <div className="border-2 border-white p-12 text-center">
              <p className="text-gray-400 text-lg font-bold">NO NOTES IN THIS CATEGORY</p>
              <p className="text-gray-500">Create a note to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={() => {}}
                  onDelete={(id) => deleteNoteMutation.mutate({ id })}
                  onToggleComplete={(id, isCompleted) =>
                    toggleCompleteMutation.mutate({ id, isCompleted })
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </BrutalistDashboard>
  );
}
