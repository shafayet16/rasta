"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "../../components/AdminNavbar";

const AVAILABLE_SIZES = ["S", "M", "L", "XL"];

export default function NewProductPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>(["S", "M", "L", "XL"]);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function toggleSize(size: string) {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    const incomingFiles = Array.from(e.target.files);

    const updatedFiles = [...files, ...incomingFiles];
    setFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(updatedPreviews);
  }

  function removeFile(indexToRemove: number) {
    const updatedFiles = files.filter((_, idx) => idx !== indexToRemove);
    setFiles(updatedFiles);

    const updatedPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
    setPreviews(updatedPreviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (files.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    if (!name || !price) return;

    if (selectedSizes.length === 0) {
      alert("Please select at least one size.");
      return;
    }

    setLoading(true);

    try {
      // 1. Upload images concurrently to Cloudflare R2
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        const text = await uploadRes.text();
        let uploadData;
        try {
          uploadData = JSON.parse(text);
        } catch {
          throw new Error(`Upload API returned non-JSON response (${uploadRes.status})`);
        }

        if (!uploadRes.ok) {
          throw new Error(uploadData.error || "Image upload failed");
        }

        return uploadData.url as string;
      });

      const imageUrls = await Promise.all(uploadPromises);

      // 2. Save product details in Neon DB
      const dbRes = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          price,
          description,
          sizes: selectedSizes,
          images: imageUrls,
        }),
      });

      const dbText = await dbRes.text();
      let dbData;
      try {
        dbData = JSON.parse(dbText);
      } catch {
        throw new Error(`Products API returned non-JSON response (${dbRes.status})`);
      }

      if (!dbRes.ok) {
        throw new Error(dbData.error || "Failed to save product details");
      }

      router.push("/admin");
    } catch (err: any) {
      alert(err.message || "An error occurred during submission.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNavbar />

      <main className="mx-auto max-w-lg px-6 pt-28 pb-24 sm:px-12">
        <h1 className="border-b border-black/10 pb-4 text-[12px] font-medium tracking-[0.25em] uppercase">
          PUBLISH NEW PRODUCT
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6 text-[11px] tracking-wider uppercase">
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

          <div>
            <label className="mb-2 block text-black/60">Product Images</label>
            <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center border border-dashed border-black/30 hover:border-black hover:bg-black/5 transition-colors">
              <span className="text-[10px] tracking-widest">
                + ADD IMAGES ({files.length} SELECTED)
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {previews.length > 0 && (
            <div>
              <label className="mb-2 block text-black/60">Gallery Queue ({previews.length})</label>
              <div className="grid grid-cols-4 gap-2">
                {previews.map((src, index) => (
                  <div key={index} className="relative group border border-black/10">
                    <img
                      src={src}
                      alt={`Preview ${index + 1}`}
                      className="h-20 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-0 right-0 bg-black text-white text-[9px] px-1.5 py-0.5 opacity-80 hover:opacity-100"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-black p-4 font-medium tracking-[0.2em] uppercase text-white hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {loading ? `UPLOADING ${files.length} IMAGES...` : "PUBLISH PRODUCT"}
          </button>
        </form>
      </main>
    </div>
  );
}