import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Search, MapPin, Tag } from "lucide-react";

import { api, fileUrl } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pager } from "@/components/Pager";

export const Route = createFileRoute("/items")({
  component: ItemsPage,
});

type Item = {
  _id: string;
  title: string;
  description: string;
  type: "lost" | "found";
  category?: string;
  location?: string;
  imageUrl?: string;
  status: "open" | "claimed";
  postedBy?: { _id: string; name: string } | string;
  createdAt: string;
};

type Listing<T> = { data: T[]; total: number; page: number; totalPages: number };

function ItemsPage() {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<Listing<Item>>({
    queryKey: ["items", { page, search, type }],
    queryFn: () =>
      api("/api/items", {
        query: { page, limit: 9, q: search, type: type === "all" ? "" : type },
      }),
  });

  const claimMut = useMutation({
    mutationFn: (id: string) => api(`/api/items/${id}/claim`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Marked as claimed");
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => api(`/api/items/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["items"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(q);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Lost &amp; Found</h1>
          <p className="text-sm text-muted-foreground">
            Browse lost items or post one you've found.
          </p>
        </div>
        {isAuthenticated && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" /> Post item
              </Button>
            </DialogTrigger>
            <ItemForm onSuccess={() => setOpen(false)} />
          </Dialog>
        )}
      </div>

      <form onSubmit={onSearch} className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title or description…"
            className="pl-8"
          />
        </div>
        <Select value={type} onValueChange={(v) => { setType(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="lost">Lost</SelectItem>
            <SelectItem value="found">Found</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" variant="secondary">Search</Button>
      </form>

      {isLoading ? (
        <p className="py-12 text-center text-muted-foreground">Loading…</p>
      ) : !data || data.data.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">No items yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((it) => {
            const ownerId = typeof it.postedBy === "string" ? it.postedBy : it.postedBy?._id;
            const canManage = isAdmin || (user && ownerId === user._id);
            return (
              <Card key={it._id} className="overflow-hidden">
                {it.imageUrl && (
                  <img
                    src={fileUrl(it.imageUrl)}
                    alt={it.title}
                    className="h-40 w-full object-cover"
                  />
                )}
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{it.title}</CardTitle>
                    <Badge variant={it.type === "lost" ? "destructive" : "default"}>
                      {it.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">{it.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {it.category && (
                      <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3" />{it.category}</span>
                    )}
                    {it.location && (
                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{it.location}</span>
                    )}
                  </div>
                  {it.status === "claimed" && (
                    <Badge variant="secondary">Claimed</Badge>
                  )}
                  {isAuthenticated && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {it.status === "open" && (
                        <Button size="sm" variant="outline" onClick={() => claimMut.mutate(it._id)}>
                          Mark claimed
                        </Button>
                      )}
                      {canManage && (
                        <Button size="sm" variant="ghost" onClick={() => deleteMut.mutate(it._id)}>
                          Delete
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Pager page={data?.page || 1} totalPages={data?.totalPages || 1} onChange={setPage} />
    </div>
  );
}

function ItemForm({ onSuccess }: { onSuccess: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"lost" | "found">("lost");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("description", description);
      fd.append("type", type);
      if (category) fd.append("category", category);
      if (location) fd.append("location", location);
      if (file) fd.append("image", file);
      return api("/api/items", { method: "POST", formData: fd });
    },
    onSuccess: () => {
      toast.success("Item posted");
      qc.invalidateQueries({ queryKey: ["items"] });
      onSuccess();
    },
    onError: (e: any) => toast.error(e.message),
  });

  const onFile = (f: File | null) => {
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Post a lost or found item</DialogTitle>
        <DialogDescription>Add a clear description and photo if you can.</DialogDescription>
      </DialogHeader>
      <form
        className="space-y-3"
        onSubmit={(e) => { e.preventDefault(); mut.mutate(); }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as "lost" | "found")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Electronics" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Title</Label>
          <Input required value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea required value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </div>
        <div className="space-y-2">
          <Label>Location</Label>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Library 2nd floor" />
        </div>
        <div className="space-y-2">
          <Label>Image (optional)</Label>
          <Input type="file" accept="image/*" onChange={(e) => onFile(e.target.files?.[0] || null)} />
          {preview && <img src={preview} alt="Preview" className="h-32 w-full rounded-md object-cover" />}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={mut.isPending}>
            {mut.isPending ? "Posting…" : "Post item"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
