# CatSubCatManager.tsx Refactoring Plan

## 1. Current State Analysis

### Existing State Variables

| State Variable       | Type               | Purpose                                              | Issue                                                    |
| -------------------- | ------------------ | ---------------------------------------------------- | -------------------------------------------------------- |
| `categories`         | `Category[]`       | Master list of categories and subcategories from API | ✅ Required - source of truth                            |
| `filteredCategories` | `Category[]`       | Search-filtered list                                 | ❌ Redundant - derived from `categories` + `searchQuery` |
| `searchQuery`        | `string`           | User search input                                    | ✅ Required                                              |
| `editData`           | `EditData \| null` | Data being edited                                    | ✅ Concept needed - will become `draft`                  |
| `isEditing`          | `boolean`          | Flag controlling editor visibility                   | ❌ Should be removed                                     |
| `loading`            | `boolean`          | Data fetching status                                 | ✅ Required                                              |

### Current Data Flow

```
User clicks edit → setEditData() + setIsEditing(true)
User searches → setSearchQuery() → useEffect updates filteredCategories
User saves → handleSaveEdit() → API call → fetchData() → handleCancelEdit()
User cancels → handleCancelEdit() → setEditData(null) + setIsEditing(false)
```

### Problems Identified

1. **Redundant State**: `filteredCategories` duplicates `categories` filtered by `searchQuery`
2. **Dual Mode Control**: `isEditing` + `editData` both control editing state
3. **Conditional Editor**: Editor panel only renders when `isEditing` is true
4. **Mixed Concerns**: Single component handles list, editing, and creation
5. **No Create Flow**: Current code only handles edits, not creation of new items

---

## 2. Proposed State Design

### Single Draft State Object

```typescript
interface Draft {
	id?: string; // Present = edit mode, Absent = create mode
	title: string;
	parentCategoryId: string | null; // null = category (top-level), string = subcategory (child of that category)
	imageFile?: File;
	shouldDeleteImage?: boolean;
}
```

### State Variables After Refactoring

| State Variable | Type         | Purpose                             |
| -------------- | ------------ | ----------------------------------- |
| `categories`   | `Category[]` | Master list from API (unchanged)    |
| `searchQuery`  | `string`     | Search input (unchanged)            |
| `draft`        | `Draft`      | Current entity being edited/created |
| `loading`      | `boolean`    | Loading state (unchanged)           |

### Draft Initialization Rules

| Scenario           | draft.id      | draft.title      | draft.parentCategoryId |
| ------------------ | ------------- | ---------------- | ---------------------- |
| Create category    | `undefined`   | `""`             | `null`                 |
| Create subcategory | `undefined`   | `""`             | `category.id`          |
| Edit category      | `category.id` | `category.title` | `null`                 |
| Edit subcategory   | `sub.id`      | `sub.title`      | `sub.categoryId`       |

**Key Derivation:**

- `draft.parentCategoryId === null` → category (top-level)
- `draft.parentCategoryId === string` → subcategory (child of that category)

---

## 3. Simple Draft Model

The system always operates on a single `draft` state. There are no modes (ViewMode, EditMode, etc.).

**Behavior:**

- On load: `draft` starts as empty category (no id, parentCategoryId: null)
- User actions replace the draft entirely
- Cancel: resets draft to empty category
- Save: API call → refresh data → reset draft to empty category

**Draft determines everything:**

- `!draft.id` → creating new
- `draft.id` → editing existing
- `draft.parentCategoryId === null` → category (top-level)
- `draft.parentCategoryId !== null` → subcategory (child)

---

## 4. Before/After Comparison Table

| Aspect                      | Before                                                | After                                        |
| --------------------------- | ----------------------------------------------------- | -------------------------------------------- |
| **Editor Visibility**       | Controlled by `isEditing` boolean                     | Always visible                               |
| **Create vs Edit**          | Implicit (only edit exists)                           | Derived from `draft.id` presence             |
| **Category vs Subcategory** | Implicit via `type` field                             | Derived from `draft.parentCategoryId`        |
| **State Count**             | 6 state variables                                     | 4 state variables                            |
| **Filtered Categories**     | Separate `useState` + `useEffect`                     | `useMemo` derived value                      |
| **Parent Category**         | `categoryId` in `EditData`                            | `parentCategoryId` in `draft` with UI "none" |
| **Edit Data Type**          | `EditData \| null`                                    | `Draft` (always defined)                     |
| **Cancel Action**           | Sets `editData` to null                               | Resets `draft` to empty category draft       |
| **Editor Panel**            | Conditionally rendered with `{isEditing && <editor>}` | Always rendered                              |

### Key Behavioral Changes

| Behavior        | Before                    | After                                  |
| --------------- | ------------------------- | -------------------------------------- |
| Initial load    | No editor shown           | Editor shown with empty category draft |
| Select category | Opens editor panel        | Populates editor with category data    |
| Create new      | Not supported             | Always available via "New" buttons     |
| Clear selection | Cancels edit, hides panel | Cancels edit, shows empty draft        |

---

## 5. Proposed Component Structure

### Helper Functions (Outside Component)

```typescript
// Type definitions
interface Draft {
	id?: string;
	title: string;
	parentCategoryId: string | null; // null = category, string = subcategory
	imageFile?: File;
	shouldDeleteImage?: boolean;
}

// Initial draft factory functions
function createEmptyCategoryDraft(): Draft {
	return { title: "", parentCategoryId: null };
}

function createEmptySubCategoryDraft(parentCategoryId: string): Draft {
	return { title: "", parentCategoryId };
}

function createDraftFromCategory(category: Category): Draft {
	return {
		id: category.id,
		title: category.title || "",
		parentCategoryId: null,
		shouldDeleteImage: false,
	};
}

function createDraftFromSubCategory(sub: SubCategory): Draft {
	return {
		id: sub.id,
		title: sub.title,
		parentCategoryId: sub.categoryId,
	};
}

// Filter function (for useMemo)
function filterCategories(
	categories: Category[],
	searchQuery: string,
): Category[] {
	if (!searchQuery) return categories;

	return categories
		.map((cat) => ({
			...cat,
			subCategories: cat.subCategories.filter((sub) =>
				sub.title.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter(
			(cat) =>
				cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				cat.subCategories.length > 0,
		);
}
```

### Component Internal Structure

```typescript
export default function CatSubCatManager() {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState<Draft>(createEmptyCategoryDraft());
  const [loading, setLoading] = useState(true);

  // Derived state
  const filteredCategories = useMemo(
    () => filterCategories(categories, searchQuery),
    [categories, searchQuery],
  );

  // Computed helpers
  const isCreating = !draft.id;
  const isEditingCategory = draft.parentCategoryId === null;
  const isEditingSubCategory = draft.parentCategoryId !== null;

  // Handlers
  const handleCreateCategory = () => setDraft(createEmptyCategoryDraft());
  const handleCreateSubcategory = (parentId?: string) =>
    setDraft(createEmptySubCategoryDraft(parentId));
  const handleEdit = (item: Category | SubCategory) => {
    if ("subCategories" in item) {
      setDraft(createDraftFromCategory(item));
    } else {
      setDraft(createDraftFromSubCategory(item));
    }
  };
  const handleCancel = () => setDraft(createEmptyCategoryDraft());
  const handleDraftChange = (updates: Partial<Draft>) => {
    setDraft((prev) => ({ ...prev, ...updates }));
  };
  const handleSave = async () => { /* ... */ };
  const handleRemoveImage = () => { /* ... */ };

  // Render
  return (
    <div className="flex h-full gap-4 p-4">
      {/* Left: List Section */}
      <ListSection
        categories={filteredCategories}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onEdit={handleEdit}
        onCreateCategory={handleCreateCategory}
        onCreateSubcategory={handleCreateSubcategory}
        selectedId={draft.id}
      />

      {/* Right: Editor Section (Always Visible) */}
      <EditorSection
        draft={draft}
        onChange={handleDraftChange}
        onSave={handleSave}
        onCancel={handleCancel}
        categories={categories}
      />
    </div>
  );
}
```

---

## 6. Key Changes Detail

### 6.1 Draft State Structure and Initialization

**Before:**

```typescript
const [editData, setEditData] = useState<EditData | null>(null);
const [isEditing, setIsEditing] = useState(false);
```

**After:**

```typescript
const [draft, setDraft] = useState<Draft>(createEmptyCategoryDraft());

function createEmptyCategoryDraft(): Draft {
	return { title: "", parentCategoryId: null };
}

function createEmptySubCategoryDraft(parentCategoryId: string): Draft {
	return { title: "", parentCategoryId };
}
```

**Rationale:**

- `draft` is always defined (no `null` state)
- Clear separation of creation vs editing via `draft.id`
- Category vs subcategory derived from `parentCategoryId`:
  - `null` = top-level category
  - `string` = subcategory (child of that category ID)

### 6.2 Combobox Logic for Category/Subcategory

**Before:**

```typescript
<Combobox
  value={editData?.categoryId}
  onValueChange={(value) =>
    setEditData(editData ? { ...editData, categoryId: value } : null)
  }
  placeholder="گروه اصلی"
/>
```

**After:**

```typescript
const categoryOptions = useMemo(() => [
  { value: "none", label: "دسته اصلی (جدید)" },
  ...categories.map((cat) => ({
    value: cat.id,
    label: cat.title || "بدون عنوان",
  })),
], [categories]);

<Combobox
  options={categoryOptions}
  value={draft.parentCategoryId === null ? "none" : draft.parentCategoryId}
  onValueChange={(value) =>
    handleDraftChange({ parentCategoryId: value === "none" ? null : value })
  }
  placeholder="گروه اصلی"
/>
```

**Rationale:**

- `"none"` only in UI layer for user selection
- When "none" is selected, store `null` in draft
- When a category is selected, store that category ID string
- Display: show `null` as "none" in UI

### 6.3 Memoized filteredCategories Using useMemo

**Before:**

```typescript
const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);

useEffect(() => {
	if (!searchQuery) {
		setFilteredCategories(categories);
		return;
	}
	const filtered = setFilteredCategories(filtered); // ... filter logic
}, [searchQuery, categories]);
```

**After:**

```typescript
const filteredCategories = useMemo(() => {
	if (!searchQuery) return categories;

	return categories
		.map((cat) => ({
			...cat,
			subCategories: cat.subCategories.filter((sub) =>
				sub.title.toLowerCase().includes(searchQuery.toLowerCase()),
			),
		}))
		.filter(
			(cat) =>
				cat.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				cat.subCategories.length > 0,
		);
}, [categories, searchQuery]);
```

**Benefits:**

- No separate state to sync
- No useEffect to manage
- Automatically recalculates when dependencies change
- Single source of truth for filtered data

### 6.4 Save Handler Logic (Create vs Update)

**Before:**

```typescript
const handleSaveEdit = async () => {
	if (!editData) return;

	if (editData.type === "category") {
		// PUT /categories/:id
	} else {
		// PUT /sub-categories/:id
	}
	await fetchData();
	handleCancelEdit();
};
```

**After:**

```typescript
const handleSave = async () => {
	try {
		const token = localStorage.getItem("token");
		const isCategory = draft.parentCategoryId === null;

		if (isCategory) {
			if (draft.id) {
				// UPDATE existing category
				await apiFetch(`${API_BASE}/categories/${draft.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({ title: draft.title }),
				});

				// Handle image changes...
				if (draft.shouldDeleteImage) {
					await apiFetch(`${API_BASE}/categories/${draft.id}/image`, {
						method: "DELETE",
						headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
					});
				}
				if (draft.imageFile) {
					const formData = new FormData();
					formData.append("image", draft.imageFile);
					await apiFetch(`${API_BASE}/categories/${draft.id}/image`, {
						method: "PUT",
						headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
						body: formData,
					});
				}
			} else {
				// CREATE new category
				await apiFetch(`${API_BASE}/categories`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({ title: draft.title }),
				});
			}
		} else {
			// Subcategory logic (create or update)
			if (draft.id) {
				// UPDATE existing subcategory
				await apiFetch(`${API_BASE}/sub-categories/${draft.id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({
						title: draft.title,
						categoryId: draft.parentCategoryId,
					}),
				});
			} else {
				// CREATE new subcategory
				await apiFetch(`${API_BASE}/sub-categories`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
					body: JSON.stringify({
						title: draft.title,
						categoryId: draft.parentCategoryId,
					}),
				});
			}
		}

		await fetchData();
		handleCancel();
	} catch (error) {
		console.error("Failed to save:", error);
	}
};
```

**Key Logic:**

```typescript
const isCreating = !draft.id;
const isCategory = draft.parentCategoryId === null;
const endpoint = isCreating ? "" : `/${draft.id}`;
const method = isCreating ? "POST" : "PUT";
```

---

## 7. Migration Steps

### Step 1: Update Type Definitions

- [ ] Rename `EditData` interface to `Draft`
- [ ] Add `id?: string` optional property
- [ ] Rename `categoryId` to `parentCategoryId: string | null`
- [ ] Remove `type` field from Draft

> **Note:** Use inline condition `draft.parentCategoryId === null` directly instead of helper functions - it's clearer and idiomatic.

### Step 2: Create Helper Functions

- [ ] Create `createEmptyCategoryDraft()`
- [ ] Create `createEmptySubCategoryDraft()`
- [ ] Create `createDraftFromCategory()`
- [ ] Create `createDraftFromSubCategory()`

> **Note:** Do NOT add `isCategory()` and `isSubCategory()` helper functions. Use inline condition `draft.parentCategoryId === null` directly.

- [ ] Create `filterCategories()` for useMemo

### Step 3: Refactor State

- [ ] Remove `filteredCategories` state
- [ ] Remove `isEditing` state
- [ ] Add `draft` state with initial empty category draft
- [ ] Add `useMemo` for `filteredCategories`

### Step 4: Update Handlers

- [ ] Replace `handleEdit()` to set draft based on category/subcategory
- [ ] Create `handleCreateCategory()` and `handleCreateSubcategory()`
- [ ] Replace `handleCancelEdit()` with `handleCancel()`
- [ ] Refactor `handleSaveEdit()` to `handleSave()` with create/update logic
- [ ] Update `handleRemoveImage()` to work with draft

### Step 5: Update UI - Editor Panel

- [ ] Remove conditional rendering `{isEditing && <editor>}`
- [ ] Always render editor panel
- [ ] Update Combobox options to include "none" UI option
- [ ] Update Combobox to store `null` when "none" selected, category ID when category selected
- [ ] Update button text based on `draft.id` presence

### Step 6: Update UI - List Section

- [ ] Add "New Category" and "New Subcategory" buttons
- [ ] Update edit buttons to call `handleEdit()`
- [ ] Highlight selected item based on `draft.id`

### Step 7: Update UI - Form Fields

- [ ] Connect title input to `draft.title`
- [ ] Connect Combobox to `draft.parentCategoryId` with UI "none" translation
- [ ] Update image preview logic for draft
- [ ] Update save button text (create vs edit)

### Step 8: Testing Checklist

- [ ] Verify search filtering works correctly
- [ ] Verify creating new category works
- [ ] Verify creating new subcategory works
- [ ] Verify editing existing category works
- [ ] Verify editing existing subcategory works
- [ ] Verify cancel resets to empty draft
- [ ] Verify image upload/delete for categories
- [ ] Verify parent category assignment for subcategories

---

## 8. File Changes Summary

| Change                     | Lines Affected  | Type                 |
| -------------------------- | --------------- | -------------------- |
| Type definition updates    | 48-55           | Modify               |
| Helper functions           | New (~40 lines) | Add                  |
| State declarations         | 60-65           | Modify               |
| useMemo filteredCategories | New (~15 lines) | Add                  |
| Handler functions          | 109-215         | Rewrite              |
| Editor panel JSX           | 334-430         | Modify               |
| List section JSX           | 226-329         | Modify               |
| Import statements          | 1-19            | Update (add useMemo) |

**Total estimated changes:** ~150-200 lines modified/added
