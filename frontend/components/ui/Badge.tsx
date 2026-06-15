interface BadgeProps {
  label: string;
  color?: 'green' | 'blue' | 'gray' | 'amber';
  onClick?: () => void;
}
 
const colorMap = {
  green: 'bg-green-100 text-green-700 hover:bg-green-200',
  blue:  'bg-blue-100 text-blue-700 hover:bg-blue-200',
  gray:  'bg-gray-100 text-gray-600 hover:bg-gray-200',
  amber: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
};
 
export default function Badge({ label, color = 'green', onClick }: BadgeProps) {
  const cls = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
    transition-colors ${colorMap[color]} ${onClick ? 'cursor-pointer' : ''}`;
  return onClick ? (
    <button type="button" className={cls} onClick={onClick}>{label}</button>
  ) : (
    <span className={cls}>{label}</span>
  );
}