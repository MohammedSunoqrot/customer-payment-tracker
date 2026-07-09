export function DemoBanner() {
  return (
    <div className="shrink-0 bg-amber-100 px-3 py-1.5 text-center text-xs text-amber-900">
      نسخة تجريبية — البيانات محفوظة على هذا الجهاز فقط ولا تُزامَن
      <span className="mx-1 text-amber-700">·</span>
      <span dir="ltr" className="inline-block">
        Demo — data stays on this device only, nothing syncs
      </span>
    </div>
  )
}
