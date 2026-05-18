# Task Spec: task-3

## Create AISummaryPopup component

### Steps

1. **Create component**
   
   Create `@/components/ai/AISummaryPopup.tsx`:
   ```tsx
   "use client";
   
   import { Sparkles, X } from "tabler-icons-react";
   import { useEffect, useRef } from "react";
   
   interface AISummaryPopupProps {
     isOpen: boolean;
     summary: string | null;
     isLoading: boolean;
     error: string | null;
     onClose: () => void;
     onRetry: () => void;
   }
   
   export default function AISummaryPopup({
     isOpen,
     summary,
     isLoading,
     error,
     onClose,
     onRetry,
   }: AISummaryPopupProps) {
     const popupRef = useRef<HTMLDivElement>(null);
   
     // Close on click outside
     useEffect(() => {
       if (!isOpen) return;
   
       function handleClickOutside(event: MouseEvent) {
         if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
           onClose();
         }
       }
   
       document.addEventListener("mousedown", handleClickOutside);
       return () => document.removeEventListener("mousedown", handleClickOutside);
     }, [isOpen, onClose]);
   
     if (!isOpen) return null;
   
     return (
       <div
         ref={popupRef}
         className="fixed bottom-4 right-4 z-50 max-w-[400px] w-full 
                    rounded-xl bg-bg-secondary p-4 shadow-lg
                    animate-slide-up sm:bottom-4 sm:right-4
                    max-sm:bottom-0 max-sm:right-0 max-sm:rounded-xl"
       >
         {/* Header */}
         <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-primary" />
             <span className="font-medium">AI สรุปบทความ</span>
           </div>
           <button
             onClick={onClose}
             className="p-1 hover:bg-bg-tertiary rounded transition-colors"
             aria-label="ปิด"
           >
             <X className="w-5 h-5" />
           </button>
         </div>
   
         {/* Content */}
         <div className="min-h-[80px]">
           {isLoading && (
             <div className="flex items-center justify-center h-20">
               <div className="animate-spin rounded-full h-6 w-6 border-2 
                           border-primary border-t-transparent" />
             </div>
           )}
   
           {error && (
             <div className="text-center">
               <p className="text-red-500 text-sm mb-3">{error}</p>
               <button
                 onClick={onRetry}
                 className="px-4 py-2 bg-primary text-white rounded-lg 
                          hover:opacity-90 transition-opacity"
               >
                 ลองใหม่
               </button>
             </div>
           )}
   
           {summary && !isLoading && !error && (
             <p className="text-sm leading-relaxed whitespace-pre-wrap">
               {summary}
             </p>
           )}
         </div>
       </div>
     );
   }
   ```

2. **Add animations**
   
   Add to global CSS or Tailwind config:
   ```css
   @keyframes slide-up {
     from { opacity: 0; transform: translateY(10px); }
     to { opacity: 1; transform: translateY(0); }
   }
   .animate-slide-up {
     animation: slide-up 200ms ease-out;
   }
   ```

3. **Verify types**
   
   Ensure `isOpen`, `isLoading`, `error`, `onRetry` are passed correctly.

### Verification
- Component renders correctly in all states
- Click outside closes popup
- X button closes popup
- Retry works

### Dependencies
- task-2 (server action exists)