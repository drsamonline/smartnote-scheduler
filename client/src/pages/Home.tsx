import { useState, useMemo } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { BrutalistDashboard } from "@/components/BrutalistDashboard";
import { NoteCard } from "@/components/NoteCard";
import { NotePreview } from "@/components/NotePreview";
import { EditNoteDialog } from "@/components/EditNoteDialog";
import { NoteFilters } from "@/components/NoteFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [noteContent, setNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [showStats, setShowStats] = useState(true);
  const [preview, setPreview] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hideCompleted, setHideCompleted] = useState(false);
  const [sortBy, setSortBy] = useState<"date" | "priority" | "category">("date");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Queries
  const { data: notes = [], isLoading, refetch } = trpc.notes.list.useQuery();
  const { data: stats } = trpc.notes.stats.useQuery();

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Tasks: 0,
      Deadlines: 0,
      Schedule: 0,
      Thoughts: 0,
      Learning: 0,
    };
    notes.forEach((note) => {
      if (note.category in counts) {
        counts[note.category]++;
      }
    });
    return counts;
  }, [notes]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    // Apply hide completed filter
    if (hideCompleted) {
      filtered = filtered.filter((note) => !note.isCompleted);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = a.dueDate || a.scheduledDate || a.createdAt;
        const dateB = b.dueDate || b.scheduledDate || b.createdAt;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      } else if (sortBy === "priority") {
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        return priorityOrder[a.priority as keyof typeof priorityOrder] - priorityOrder[b.priority as keyof typeof priorityOrder];
      } else {
        // category
        return a.category.localeCompare(b.category);
      }
    });

    return sorted;
  }, [notes, hideCompleted, sortBy]);

  // Mutations
  const createNoteMutation = trpc.notes.create.useMutation({
    onSuccess: () => {
      setNoteContent("");
      setPreview(null);
      refetch();
    },
  });

  const deleteNoteMutation = trpc.notes.delete.useMutation({
    onSuccess: () => refetch(),
  });

  const toggleCompleteMutation = trpc.notes.toggleComplete.useMutation({
    onSuccess: () => refetch(),
  });

  const updateNoteMutation = trpc.notes.updateNote.useMutation({
    onSuccess: () => {
      setEditingNote(null);
      setIsEditDialogOpen(false);
      refetch();
    },
  });

  // Simulate AI analysis for preview
  const handleContentChange = (value: string) => {
    setNoteContent(value);
    
    // Show preview after 500ms of typing
    if (value.trim().length > 10) {
      setIsAnalyzing(true);
      setTimeout(() => {
        // Mock preview - in real app this would call the AI
        const mockCategories = ["Tasks", "Deadlines", "Schedule", "Thoughts", "Learning"];
        const mockPriorities = ["Low", "Medium", "High"];
        const randomCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
        const randomPriority = mockPriorities[Math.floor(Math.random() * mockPriorities.length)];
        
        setPreview({
          category: randomCategory,
          priority: randomPriority,
          title: value.substring(0, 50) || "Untitled",
          extractedDate: value.includes("tomorrow") ? "Tomorrow" : undefined,
        });
        setIsAnalyzing(false);
      }, 800);
    } else {
      setPreview(null);
      setIsAnalyzing(false);
    }
  };

  const handleCreateNote = async () => {
    if (!noteContent.trim()) return;
    setIsSubmitting(true);
    try {
      await createNoteMutation.mutateAsync({ content: noteContent });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async (data: any) => {
    if (!editingNote) return;
    await updateNoteMutation.mutateAsync({
      id: editingNote.id,
      ...data,
    });
  };

  if (!user) return null;

  return (
    <BrutalistDashboard categoryCounts={categoryCounts}>
      <div className="bg-black text-white min-h-screen">
        {/* Header */}
        <div className="border-b-2 border-white p-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">CAPTURE</h1>
          <div className="h-1 bg-red-600 w-24 mb-4"></div>
          <p className="text-gray-400 text-lg">AI-powered note organization in real-time</p>
        </div>

        {/* Stats Widget */}
        {showStats && stats && (
          <div className="border-b-2 border-white p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="border-2 border-white p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400">TOTAL</p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <div className="border-2 border-white p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400">COMPLETED</p>
                <p className="text-4xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="border-2 border-white p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400">PENDING</p>
                <p className="text-4xl font-bold text-blue-600">{stats.pending}</p>
              </div>
              <div className="border-2 border-white p-4">
                <p className="text-xs font-bold tracking-widest text-gray-400">OVERDUE</p>
                <p className="text-4xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
            <Button
              onClick={() => setShowStats(false)}
              variant="ghost"
              className="text-gray-400 hover:text-white text-xs"
            >
              HIDE STATS
            </Button>
          </div>
        )}

        {/* Input Section */}
        <div className="border-b-2 border-white p-8">
          <h2 className="text-3xl font-bold mb-6">NEW NOTE</h2>
          <div className="space-y-4">
            <Textarea
              value={noteContent}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Type anything... AI will auto-categorize it"
              className="bg-gray-900 border-2 border-white text-white placeholder-gray-500 p-4 font-mono"
              rows={4}
            />
            <NotePreview isAnalyzing={isAnalyzing} preview={preview} />
            <div className="flex gap-4">
              <Button
                onClick={handleCreateNote}
                disabled={!noteContent.trim() || isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    PROCESSING
                  </>
                ) : (
                  "CREATE NOTE"
                )}
              </Button>
              <Button
                onClick={() => {
                  setNoteContent("");
                  setPreview(null);
                }}
                variant="outline"
                className="border-2 border-white text-white hover:bg-gray-900 font-bold"
              >
                CLEAR
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-8 border-b-2 border-white">
          <NoteFilters
            hideCompleted={hideCompleted}
            onHideCompletedChange={setHideCompleted}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {/* Notes List */}
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6">
            ALL NOTES {filteredAndSortedNotes.length > 0 && `(${filteredAndSortedNotes.length})`}
          </h2>
          <div className="h-1 bg-red-600 w-24 mb-8"></div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </div>
          ) : filteredAndSortedNotes.length === 0 ? (
            <div className="border-2 border-white p-12 text-center">
              <p className="text-gray-400 text-lg font-bold">NO NOTES YET</p>
              <p className="text-gray-500">Start by typing something above</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAndSortedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
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

      {/* Edit Dialog */}
      <EditNoteDialog
        note={editingNote}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveEdit}
        isLoading={updateNoteMutation.isPending}
      />
    </BrutalistDashboard>
  );
}
