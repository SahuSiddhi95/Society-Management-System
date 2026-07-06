export default function PlaceholderPage({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <p className="text-2xl mb-2">🚧</p>
      <p className="text-lg font-bold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1">This page is coming soon</p>
    </div>
  );
}