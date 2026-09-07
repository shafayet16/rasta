"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../../components/AdminNavbar";

const AVAILABLE_SIZES = ["S", "M", "L", "XL"];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch product");
        }

        setName(data.name || "");
        setPrice(data.price ? String(data.price) : "");
        setDescription(data.description || "");
        setInStock(data.in_stock ?? true);
        setSelectedSizes(data.sizes || ["S", "M", "L", "XL"]);
        setExistingImages(data.images || []);
      } catch (err: any) {
        console.error("Fetch product error:", err);
        alert(err.message || "Product not found");
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  function toggleSize(size: string) {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const selectedFiles = Array.from(e.target.files);
    
    setNewFiles((prev) => [...prev, ...selectedFiles]);

    const newPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviewUrls]);

    e.target.value = "";
  }

  function removeExistingImage(indexToRemove: number) {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  function removeNewFile(indexToRemove: number) {
    URL.revokeObjectURL(previews[indexToRemove]);

    setNewFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setPreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }

    setSaving(true);

    try {
      let finalImages = [...existingImages];

      if (newFiles.length > 0) {
        const uploadPromises = newFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || "Image upload failed");
          return uploadData.url as string;
        });

        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      if (finalImages.length === 0) {
        alert("Product must have at least one image.");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          description,
          inStock,
          sizes: selectedSizes,
          images: finalImages,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to update product");
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black">
        <AdminNavbar />
        <div className="pt-32 px-12 text-[11px] font-mono tracking-widest uppercase">Loading Product...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNavbar />

      <main className="mx-auto max-w-lg px-6 pt-28 pb-24 sm:px-12">
        <h1 className="border-b border-black/10 pb-4 text-[12px] font-medium tracking-[0.25em] uppercase">
          EDIT PRODUCT
        </h1>

        <form onSubmit={handleUpdate} className="mt-8 flex flex-col gap-6 text-[11px] tracking-wider uppercase">
          <div>
            <label className="mb-2 block text-black/60">Product Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-black/60">Price (BDT)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-black/60">Available Sizes</label>
            <div className="flex gap-2">
              {AVAILABLE_SIZES.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`h-10 w-12 border text-[10px] font-medium transition-colors ${
                      isSelected
                        ? "border-black bg-black text-white"
                        : "border-black/20 bg-transparent text-black/40 hover:border-black/50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-black/60">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-black/20 p-3 text-black focus:border-black focus:outline-none"
            />
          </div>

          {/* CURRENT IMAGES */}
          {existingImages.length > 0 && (
            <div>
              <label className="mb-2 block text-black/60">Current Images ({existingImages.length})</label>
              <div className="grid grid-cols-4 gap-2">
                {existingImages.map((src, index) => (
                  <div key={index} className="relative group border border-black/10">
                    <img src={src} alt="Existing" className="h-20 w-full object-contain p-1" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-0 right-0 bg-black text-white text-[9px] px-1.5 py-0.5 hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* UPLOAD MULTIPLE IMAGES */}
          <div>
            <label className="mb-2 block text-black/60">Add More Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="w-full border border-black/20 p-2 text-black"
            />
          </div>

          {/* PREVIEWS OF NEW IMAGES */}
          {previews.length > 0 && (
            <div>
              <label className="mb-2 block text-black/60">New Images to Upload ({previews.length})</label>
              <div className="grid grid-cols-4 gap-2">
                {previews.map((src, index) => (
                  <div key={index} className="relative group border border-black/10">
                    <img
                      src={src}
                      alt="New Preview"
                      className="h-20 w-full object-contain p-1"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewFile(index)}
                      className="absolute top-0 right-0 bg-black text-white text-[9px] px-1.5 py-0.5 hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="inStock"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="h-4 w-4 border-black/20"
            />
            <label htmlFor="inStock" className="text-black/80">In Stock</label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-4 bg-black p-4 font-medium tracking-[0.2em] uppercase text-white hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {saving ? "SAVING CHANGES..." : "UPDATE PRODUCT"}
          </button>
        </form>
      </main>
    </div>
  );
}