"use client";

export default function AdminSidebar({ section, onChange }: { section: string; onChange: (s: any) => void }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-full flex flex-col gap-3">
      <button
        className={`text-right pr-4 py-2 rounded ${section === "categories" ? "bg-[#FFEBE5]" : "hover:bg-gray-50"}`}
        onClick={() => onChange("categories")}
      >
        مدیریت دسته بندی ها
      </button>

      <button
        className={`text-right pr-4 py-2 rounded ${section === "users" ? "bg-[#FFEBE5]" : "hover:bg-gray-50"}`}
        onClick={() => onChange("users")}
      >
        مدیریت کاربران
      </button>

      {/* Future sections can be added here */}
    </div>
  );
}
