interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="text-4xl mb-4">{icon}</div>}
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted max-w-xs">{description}</p>
      )}
      {action && (
        <a
          href={action.href}
          className="mt-4 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-[#2d3748] transition-colors"
        >
          {action.label}
        </a>
      )}
    </div>
  );
}
